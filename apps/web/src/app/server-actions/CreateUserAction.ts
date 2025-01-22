"use server"

import { z } from "zod";
import CreateAccountFormSchema from "../components/Accounts/CreateAccountForm/CreateAccountFormSchema";
import { createUser } from "../controllers/userController";
import { redirect } from "next/navigation";

export async function CreateUserAction(isInitialization: boolean = false, user: z.infer<typeof CreateAccountFormSchema>) {
    try {
        const validatedFields = CreateAccountFormSchema.safeParse(user);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const res = await createUser(isInitialization, user);

        if (typeof res === "object" && res.error) throw res.error;

    } catch (error) {
        console.log(error)
        return error;
    }
    
    redirect('/');
}