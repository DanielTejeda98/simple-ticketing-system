"use server"

import { redirect } from "next/navigation";
import { archiveProject } from "../controllers/projectController";
import { getServerSession } from "next-auth";
import { authOptions } from "../config/authOptions";

export async function ArchiveProjectAction(projectSlug: string) {
    const session = await getServerSession(authOptions);
    try {
        await archiveProject(projectSlug, session?.user.id || "");
    } catch (error) {
        console.log(error)
        return error;
    }
    
    redirect('/projects');
}