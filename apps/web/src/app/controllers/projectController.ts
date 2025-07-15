import { z } from "zod";
import NewProjectFormSchema from "../components/Projects/NewProjectForm/NewProjectFormSchema";
import dbConnect from "../utils/dbConnect";
import createLogEvent, { LOGGER_EVENTS } from "../lib/logger";
import projectModel, { Project } from "../models/projectModel";
import slugify from "../utils/slugify";
import ProjectFormSchema from "../components/Projects/ProjectForm/ProjectFormSchema";
import mongoose from "mongoose";
import { getUserPermissions, getUsers } from "./userController";
import { sendMail } from "../lib/mailer";
import ProjectAssignedEmailTemplate from "../emails/projectAssigned";
import userModel from "../models/userModel";
import { authOptions } from "../config/authOptions";
import { getServerSession } from "next-auth";
import { checkAuthAndGetUserId } from "../utils/serverHelpers";
import { accessibleBy } from "@casl/mongoose";
import { createAbility } from "../lib/appAbility";
import { checkAbility } from "../utils/checkAbility";

export const createProject = async (project: z.infer<typeof NewProjectFormSchema>, creator: string) => {
    try {
        await dbConnect();
        
        await checkAuthAndGetUserId();
        const ability = createAbility(await getUserPermissions());

        if (!checkAbility(ability, "create-any", "create", "projects")) {
            throw new Error("User does not have permissions for this action!");
        }

        let slug = slugify(project.name);
            
        // See if any projects already exist with the generated slug
        const existingProjects = await projectModel.find({
            slug: { $regex: new RegExp(slug, "i")}
        })
    
        if (existingProjects.length) {
            slug = `${slug}-${existingProjects.length + 1}`
        }
    
        const createdProject = await projectModel.create({
            name: project.name,
            slug: slug
        })

        createLogEvent({who: new mongoose.Types.ObjectId(creator), what: LOGGER_EVENTS.projectCreated, data: JSON.stringify({id: createdProject._id, name: project.name, slug })});

        return true;
    } catch (error) {
        throw error;
    }
}

export const updateProject = async (project: z.infer<typeof ProjectFormSchema>) => {
    try {
        await dbConnect();

        await checkAuthAndGetUserId();
        const ability = createAbility(await getUserPermissions());

        if (!checkAbility(ability, "update-any", "update", "projects")) {
            throw new Error("User does not have permissions for this action!");
        }

        const retrievedProject = await getProject(project.slug)
        if (!retrievedProject) {
            throw new Error(`No project found with ${project.slug}`);
        }

        const didProjectLeadChange = project.leadResource && retrievedProject.leadResource?.toString() !== project.leadResource 
        && project.leadResource !== project.updater;

        const oldLead = retrievedProject.leadResource;
        const projectLead = project.leadResource ? new mongoose.Types.ObjectId(project.leadResource) : null;
        const projectOwner = project.owningClient ? new mongoose.Types.ObjectId(project.owningClient) : null;
    
        retrievedProject.name = project.name;
        retrievedProject.description = project.description;
        retrievedProject.boughtWorkHours = project.boughtWorkHours;
        retrievedProject.leadResource = projectLead;
        retrievedProject.owningClient = projectOwner;
        retrievedProject.updatedBy = new mongoose.Types.ObjectId(project.updater);
        retrievedProject.members = processProjectMembers(project.members, projectLead, projectOwner) as mongoose.Types.Array<mongoose.Types.ObjectId>;

        await retrievedProject.save();

        if (didProjectLeadChange) {
            sendResourceLeadChangeNotification(project.leadResource!, project, oldLead?.toString())
        }

        createLogEvent({who: new mongoose.Types.ObjectId(project.updater), what: LOGGER_EVENTS.projectUpdated, data: JSON.stringify(project)});

        return true;
    } catch (error) {
        throw error;
    }
}

export const archiveProject = async (projectSlug: string, archiver: string) => {
    try {
        await dbConnect();
        await checkAuthAndGetUserId();
        const ability = createAbility(await getUserPermissions());

        if (!checkAbility(ability, "delete-any", "delete", "projects")) {
            throw new Error("User does not have permissions for this action!");
        }

        const retrievedProject = await getProject(projectSlug);

        if (!retrievedProject) throw new Error("No project found");

        retrievedProject.leadResource = null;
        retrievedProject.archived = true;
        createLogEvent({who: new mongoose.Types.ObjectId(archiver), what: LOGGER_EVENTS.projectArchived, data: JSON.stringify({projectSlug})});
        await retrievedProject.save();
    } catch (error) {
        throw error;
    }
}

export const getAllProjects = async (includeArchived?: boolean): Promise<Project[]> => {
    try {
        await dbConnect();
        
        await checkAuthAndGetUserId();
        const ability = createAbility(await getUserPermissions());

        if (!checkAbility(ability, "read-any", "read", "projects")) {
            throw new Error("User does not have permissions for this action!");
        }

        const findQuery = {
            $and: [
                { $or: [
                    accessibleBy(ability, "read").ofType("projects"),
                    accessibleBy(ability, "read-any").ofType("projects")
                ]},
                {...!includeArchived ? { archived: false } : {}}
            ]
        }
            
        return await projectModel.find(findQuery).populate({
            path: "leadResource",
            model: userModel,
            select: "firstName lastName avatar"
        }).exec()
    } catch (error) {
        throw error;
    }
}

export const getAllProjectIds = async (includeArchived?: boolean): Promise<Project[]> => {
    try {
        await dbConnect();
        const ability = createAbility(await getUserPermissions());

        const findQuery = {
            $and: [
                { $or: [
                    accessibleBy(ability, "read").ofType("projects"),
                    accessibleBy(ability, "read-any").ofType("projects")
                ]},
                {...!includeArchived ? { archived: false } : {}}
            ]
        }
            
        return await projectModel.find(findQuery).select("_id").exec()
    } catch (error) {
        throw error;
    }
}

export const getAllArchivedProjects = async (): Promise<Project[]> => {
    try {
        await dbConnect();
        
        await checkAuthAndGetUserId();
        const ability = createAbility(await getUserPermissions());

        if (!checkAbility(ability, "read-any", "read", "projects")) {
            throw new Error("User does not have permissions for this action!");
        }
        
        const findQuery = {
            $and: [
                { $or: [
                    accessibleBy(ability, "read").ofType("projects"),
                    accessibleBy(ability, "read-any").ofType("projects")
                ]},
                { archived: true }
            ]
        }
            
        return await projectModel.find(findQuery)
    } catch (error) {
        throw error;
    }
}

export const getProject = async (projectSlug: string): Promise<Project | null> => {
    try {
        await dbConnect();

        await checkAuthAndGetUserId();
        const ability = createAbility(await getUserPermissions());

        if (!checkAbility(ability, "read-any", "read", "projects")) {
            throw new Error("User does not have permissions for this action!");
        }

        return await projectModel.findOne({$and: [
            { $or: [
                accessibleBy(ability, "read").ofType("projects"),
                accessibleBy(ability, "read-any").ofType("projects")
            ]},
            { slug: projectSlug }
        ]})
    } catch (error) {
        throw error;
    }
}

const sendResourceLeadChangeNotification = async (resourceLead: string, project: z.infer<typeof ProjectFormSchema>, oldResourceLead: string|undefined) => {

    try {
        const retrievedUsers = await getUsers([resourceLead, oldResourceLead || "", project.updater]);
        if (retrievedUsers) {
            const retrievedResourceLead = retrievedUsers.find(user => (user._id as mongoose.Types.ObjectId).toString() === resourceLead);
            const retrievedOldResourceLead = retrievedUsers.find(user => (user._id as mongoose.Types.ObjectId).toString() === oldResourceLead?.toString());
            const updater = retrievedUsers.find(user => (user._id as mongoose.Types.ObjectId).toString() === project.updater);

            if (retrievedResourceLead && updater) {
                sendMail({
                    to: retrievedResourceLead.email,
                    subject: "Project assigned",
                    html: ProjectAssignedEmailTemplate(project, retrievedResourceLead, retrievedOldResourceLead, updater)
                })
            }
        }
    } catch (error) {
        throw error;
    }
    
}

const processProjectMembers = (updatedMembers: string[], lead?: mongoose.Types.ObjectId | null, owner?: mongoose.Types.ObjectId | null)
: mongoose.Types.ObjectId[] => {
    // Check if updated members includes the lead and owner, if not, push them into the array
    if (lead && !updatedMembers.includes(lead.toString())) updatedMembers.push(lead.toString());
    if (owner && !updatedMembers.includes(owner.toString())) updatedMembers.push(owner.toString());

    return updatedMembers.map(member => new mongoose.Types.ObjectId(member))
}