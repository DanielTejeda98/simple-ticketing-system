"use server"

import { z } from "zod";
import { updateUser } from "../controllers/userController";
import { redirect } from "next/navigation";
import EditUserFormSchema from "../components/Users/EditUserForm/EditUserFormSchema";

export async function UpdateUserActionFromManagement(user: z.infer<typeof EditUserFormSchema>) {
    try {
        const validatedFields = EditUserFormSchema.safeParse(user);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        await updateUser(user, true);

    } catch (error) {
        console.log(error)
        return error;
    }
    
    redirect('/users');
}