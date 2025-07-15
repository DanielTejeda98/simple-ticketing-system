import ticketTypeModel, { TicketType } from "@/app/models/ticketTypeModel";
import { z } from "zod";
import { checkAbilityServer } from "../utils/checkAbilityServer";
import dbConnect from "../utils/dbConnect";
import { TicketTypeFormSchema } from "../components/System/TicketType/TicketTypeFormSchema";

export const getAllTicketTypes = async (): Promise<TicketType[]> => {
    try {
        await dbConnect();

        const ticketTypes = await ticketTypeModel.find({}) as TicketType[];
        return ticketTypes;
    } catch (error) {
        throw error;
    }
}

export const createTicketType = async (ticketType: z.infer<typeof TicketTypeFormSchema>) => {
    try {
        await dbConnect();
        if (!checkAbilityServer("create-any", "create", "system")) {
            throw new Error("User does not have permissions for this action!");
        }

        const newTicketType = new ticketTypeModel(ticketType);
        await newTicketType.save();
        return newTicketType;
    } catch (error) {
        throw error;
    }
}

export const updateTicketType = async (id: string, ticketType: z.infer<typeof TicketTypeFormSchema>) => {
    try {
        await dbConnect();
        if (!checkAbilityServer("update-any", "update", "system")) {
            throw new Error("User does not have permissions for this action!");
        }

        const updatedTicketType = await ticketTypeModel.findByIdAndUpdate(id, ticketType, { new: true });
        return updatedTicketType;
    } catch (error) {
        throw error;
    }
}

export const deleteTicketType = async (id: string) => {
    try {
        await dbConnect();
        if (!checkAbilityServer("delete-any", "delete", "system")) {
            throw new Error("User does not have permissions for this action!");
        }

        const deletedTicketType = await ticketTypeModel.findByIdAndDelete(id);
        return deletedTicketType;
    } catch (error) {
        throw error;
    }
}