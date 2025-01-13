"use server"

import { redirect } from "next/navigation";
import { archiveProject } from "../controllers/projectController";

export async function ArchiveProjectAction(projectSlug: string) {
    try {
        await archiveProject(projectSlug);
    } catch (error) {
        console.log(error)
        return error;
    }
    
    redirect('/projects');
}