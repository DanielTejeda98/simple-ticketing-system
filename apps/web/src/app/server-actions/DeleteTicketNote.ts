"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../config/authOptions";
import { deleteNote } from "../controllers/ticketController";

export async function DeleteTicketNoteAction(ticketId: string, noteId: string) {
    const session = await getServerSession(authOptions);
    try {
        const res = await deleteNote(noteId, ticketId, session?.user.id || "");

        if (!res) throw new Error("Unable to delete note");

        return JSON.parse(JSON.stringify(res));
    } catch (error) {
        console.log(error)
        throw error;
    }
}