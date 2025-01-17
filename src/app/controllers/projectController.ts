import { z } from "zod";
import NewProjectFormSchema from "../components/Projects/NewProjectForm/NewProjectFormSchema";
import dbConnect from "../utils/dbConnect";
import createLogEvent, { LOGGER_EVENTS } from "../lib/logger";
import projectModel, { Project } from "../models/projectModel";
import slugify from "../utils/slugify";
import ProjectFormSchema from "../components/Projects/ProjectForm/ProjectFormSchema";
import mongoose from "mongoose";
import { getUsers } from "./userController";
import { sendMail } from "../lib/mailer";
import ProjectAssignedEmailTemplate from "../emails/projectAssigned";
import userModel from "../models/userModel";
import { checkAbilityServer } from "../utils/checkAbilityServer";

export const createProject = async (project: z.infer<typeof NewProjectFormSchema>, creator: string) => {
    try {
        await dbConnect();

        if(!checkAbilityServer(creator, "create-any", "create", "projects")) {
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

        if(!checkAbilityServer(project.updater, "update-any", "update", "projects")) {
            throw new Error("User does not have permissions for this action!");
        }

        const retrievedProject = await getProject(project.slug)
        const notifyResourceLead = project.leadResource && retrievedProject.leadResource?.toString() !== project.leadResource 
        && project.leadResource !== project.updater;

        const oldLead = retrievedProject.leadResource;
    
        retrievedProject.name = project.name;
        retrievedProject.description = project.description;
        retrievedProject.boughtWorkHours = project.boughtWorkHours;
        retrievedProject.leadResource = project.leadResource;
        retrievedProject.updatedBy = project.updater;

        await retrievedProject.save();

        if (notifyResourceLead) {
            sendResourceLeadChangeNotification(project.leadResource!, project, oldLead)
        }

        createLogEvent({who: new mongoose.Types.ObjectId(project.updater), what: LOGGER_EVENTS.projectUpdated, data: JSON.stringify(project)});

        return true;
    } catch (error) {
        throw error;
    }
}

export const archiveProject = async (projectSlug: string, archiver: string) => {

    if(!checkAbilityServer(archiver, "delete-any", "delete", "projects")) {
        throw new Error("User does not have permissions for this action!");
    }

    try {
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

        const findQuery = includeArchived ? {} : {archived: false}
            
        return await projectModel.find(findQuery).populate({
            path: "leadResource",
            model: userModel,
            select: "firstName lastName avatar"
        }).exec()
    } catch (error) {
        throw error;
    }
}

export const getAllArchivedProjects = async (): Promise<Project[]> => {
    try {
        await dbConnect();
            
        return await projectModel.find({archived: true})
    } catch (error) {
        throw error;
    }
}

export const getProject = async (projectSlug: string) => {
    try {
        await dbConnect();

        return await projectModel.findOne({slug: projectSlug})
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