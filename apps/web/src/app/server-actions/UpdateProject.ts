"use server"

import { z } from "zod";
import { redirect } from "next/navigation";
import { updateProject } from "../controllers/projectController";
import ProjectFormSchema from "../components/Projects/ProjectForm/ProjectFormSchema";

export async function UpdateProjectAction(project: z.infer<typeof ProjectFormSchema>) {
    try {
        const validatedFields = ProjectFormSchema.safeParse(project);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const res = updateProject(project);

        if (!res) throw new Error("Unable to create project");

    } catch (error) {
        console.log(error)
        return error;
    }
    
    redirect('/projects');
}