"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../config/authOptions";
import { Note, NoteSchema } from "../components/Ticket/UpdateTicketForm/UpdateTicketSchema";
import { createNote } from "../controllers/ticketController";

export async function CreateTicketNoteAction(ticketId: string, note: Note) {
    const session = await getServerSession(authOptions);
    try {
        const validatedFields = NoteSchema.safeParse(note);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const res = await createNote(ticketId, session?.user.id || "", note);

        if (!res) throw new Error("Unable to create note");

        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        console.log(error)
        throw error;
    }
}