"use server";
//Create server actions for ticket types
import { createTicketType, deleteTicketType, updateTicketType } from "@/app/controllers/ticketTypeController";
import { TicketTypeFormSchema } from "@/app/components/System/TicketType/TicketTypeFormSchema";
import { z } from "zod";

export async function createNewTicketType(data: z.infer<typeof TicketTypeFormSchema>) {
    const parsed = TicketTypeFormSchema.safeParse(data);
    if (!parsed.success) throw new Error("Invalid data: " + JSON.stringify(parsed.error.format()));
    
    try {
        return !!(await createTicketType(parsed.data));
    } catch (error: unknown) {
        throw error;
    }
}

export async function updateExistingTicketType(id: string, data: z.infer<typeof TicketTypeFormSchema>) {
    const parsed = TicketTypeFormSchema.safeParse(data);
    if (!parsed.success) throw new Error("Invalid data: " + JSON.stringify(parsed.error.format()));

    try {
        return !!(await updateTicketType(id, parsed.data));
    } catch (error: unknown) {
        throw error;
    }
}

export async function deleteExistingTicketType(id: string) {
    if (typeof id !== "string" || id.length === 0) throw new Error("Invalid ticket type ID");

    try {
        return !!(await deleteTicketType(id));
    } catch (error: unknown) {
        throw error;
    }
}
