"use server"

import { z } from "zod";
import { redirect } from "next/navigation";
import NewProjectFormSchema from "../components/Projects/NewProjectForm/NewProjectFormSchema";
import { createProject } from "../controllers/projectController";
import { getServerSession } from "next-auth";
import { authOptions } from "../config/authOptions";

export async function CreateProjectAction(project: z.infer<typeof NewProjectFormSchema>) {
    const session = await getServerSession(authOptions);
    try {
        const validatedFields = NewProjectFormSchema.safeParse(project);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const res = await createProject(project, session?.user.id || "");

        if (!res) throw new Error("Unable to create project");

    } catch (error) {
        console.log(error)
        return error;
    }
    
    redirect('/projects');
}