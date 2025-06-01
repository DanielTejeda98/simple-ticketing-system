import { z } from "zod";
import NewTicketFormSchema from "../components/Ticket/NewTicketForm/NewTicketFormSchema";
import { checkAbilityServer, checkAnyAbilityServer } from "../utils/checkAbilityServer";
import dbConnect from "../utils/dbConnect";
import createLogEvent, { LOGGER_EVENTS } from "../lib/logger";
import projectModel, { Project } from "../models/projectModel";
import ticketModel, { Note, Ticket } from "../models/ticketModel";
import { Note as NoteUiModel } from "../components/Ticket/UpdateTicketForm/UpdateTicketSchema";
import mongoose from "mongoose";
import userModel from "../models/userModel";

export const createTicket = async (ticket: z.infer<typeof NewTicketFormSchema>, creator: string) => {
    try {
        await dbConnect();

        if(!checkAbilityServer(creator, "create-any", "create", "tickets")) {
            throw new Error("User does not have permissions for this action!");
        }
        
        // Check if the user has access to read the project
        const userAccessQuery = !await checkAnyAbilityServer(creator, "read-any", "projects") ? { members: creator } : {};
        
        // See if any projects already exist with the generated slug
        const ticketProject = await projectModel.findOne({$and: [
            { _id: new mongoose.Types.ObjectId(ticket.project)},
            { archived: false },
            {...userAccessQuery}
        ]}) as Project;
    
        if (!ticketProject) {
            throw new Error(`No project found with ID ${ticket.project} or user does not have access to it.`);
        }
    
        const createdTicket = await ticketModel.create(ticket);
        // Add the ticket to the project
        ticketProject.tickets.push(createdTicket._id);
        await ticketProject.save();


        createLogEvent({who: new mongoose.Types.ObjectId(creator), what: LOGGER_EVENTS.ticketCreated, data: JSON.stringify({id: createdTicket._id, number: createdTicket.number })});

        return createdTicket._id.toString();
    } catch (error) {
        throw error;
    }
}

export const getTicketById = async (id: string, userId: string) => {
    try {
        await dbConnect();

        if(!checkAbilityServer(userId, "read-any", "read", "tickets")) {
            throw new Error("User does not have permissions for this action!");
        }

        const ticket = await ticketModel.findById(id)
        .populate({
            path: "project",
            model: projectModel
        })
        .populate({
            path: "caller",
            model: userModel
        })
        .populate({
            path: "assignedTo",
            model: userModel
        })
        .exec();
        
        if (!ticket) {
            throw new Error(`Ticket with ID ${id} not found.`);
        }

        return ticket;
    } catch (error) {
        throw error;
    }
}

export const createNote = async (ticketId: string, userId: string, note: NoteUiModel) => {
    try {
        await dbConnect();

        if(!checkAbilityServer(userId, "update-any", "update", "tickets")) {
            throw new Error("User does not have permissions for this action!");
        }

        const ticket = await ticketModel.findById(ticketId)
            .populate({
                path: "project",
                model: projectModel,
                select: "members"
            }).exec() as Ticket;

        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found.`);
        }

        const userCanAccessProject = (ticket.project as Project).members.includes(userId) || await checkAnyAbilityServer(userId, "read-any", "projects")

        if (!userCanAccessProject) {
            throw new Error(`User does not have access for this action`);
        }

        const createdNote = {
            user: userId,
            content: note.content
        } as Note;
        ticket.notes.unshift(createdNote);

        await ticket.save()

        return ticket.notes;
    } catch (error) {
        throw error;
    }
}

export const updateNote = async (noteId: string, ticketId: string, userId: string, note: Note) => {
    try {
        await dbConnect();

        if(!checkAbilityServer(userId, "update-any", "update", "tickets")) {
            throw new Error("User does not have permissions for this action!");
        }

        const ticket = await ticketModel.findById(ticketId)
            .populate({
                path: "project",
                model: projectModel,
                select: "members"
            }).exec() as Ticket;

        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found.`);
        }

        const userCanAccessProject = (ticket.project as Project).members.includes(userId) || await checkAnyAbilityServer(userId, "read-any", "projects")

        if (userCanAccessProject) {
            throw new Error(`User does not have access for this action`);
        }

        const storedNote = ticket.notes.find(note => note._id === noteId);

        if (!storedNote || storedNote.user != userId) {
            throw new Error(`Unable to update comment.`);
        }

        storedNote.content = note.content;
        storedNote.updatedAt = new Date();

        await ticket.save();
    } catch (error) {
        throw error;
    }
}

export const deleteNote = async (noteId: string, ticketId: string, userId: string) => {
    try {
        await dbConnect();

        if(!checkAbilityServer(userId, "update-any", "update", "tickets")) {
            throw new Error("User does not have permissions for this action!");
        }

        const ticket = await ticketModel.findById(ticketId)
            .populate({
                path: "project",
                model: projectModel,
                select: "members"
            }).exec() as Ticket;

        if (!ticket) {
            throw new Error(`Ticket with ID ${ticketId} not found.`);
        }

        const userCanAccessProject = (ticket.project as Project).members.includes(userId) || await checkAnyAbilityServer(userId, "read-any", "projects")

        if (userCanAccessProject) {
            throw new Error(`User does not have access for this action`);
        }

        const storedNote = ticket.notes.find(note => note._id === noteId);

        if (!storedNote || storedNote.user != userId) {
            throw new Error(`Unable to delete comment.`);
        }

        await ticket.updateOne({
            $pull: {
                notes: storedNote
            }
        })

        await ticket.save();
    } catch (error) {
        throw error;
    }
}