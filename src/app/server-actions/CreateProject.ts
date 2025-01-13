"use server"

import { z } from "zod";
import { redirect } from "next/navigation";
import NewProjectFormSchema from "../components/Projects/NewProjectForm/NewProjectFormSchema";
import { createProject } from "../controllers/projectController";

export async function CreateProjectAction(project: z.infer<typeof NewProjectFormSchema>) {
    try {
        const validatedFields = NewProjectFormSchema.safeParse(project);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const res = await createProject(project);

        if (!res) throw new Error("Unable to create project");

    } catch (error) {
        console.log(error)
        return error;
    }
    
    redirect('/projects');
}