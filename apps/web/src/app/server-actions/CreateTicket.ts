"use server"

import { z } from "zod";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../config/authOptions";
import NewTicketFormSchema from "../components/Ticket/NewTicketForm/NewTicketFormSchema";
import { createTicket } from "../controllers/ticketController";

export async function CreateTicketAction(ticket: z.infer<typeof NewTicketFormSchema>) {
    const session = await getServerSession(authOptions);
    let ticketId;
    try {
        const validatedFields = NewTicketFormSchema.safeParse(ticket);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const res = await createTicket(ticket, session?.user.id || "") as string;

        if (!res) throw new Error("Unable to create project");
        ticketId = res;
        
    } catch (error) {
        console.log(error)
        return error;
    }
    
    if (ticketId) redirect(`/ticket/${ticketId}`);
}