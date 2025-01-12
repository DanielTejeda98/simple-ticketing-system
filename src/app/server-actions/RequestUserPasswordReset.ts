"use server"

import { z } from "zod";
import ForgotPasswordFormSchema from "../components/Accounts/ForgotPasswordForm/ForgotPasswordFormSchema";
import { createUserPasswordResetRequest } from "../controllers/userController";

export async function RequestUserPasswordReset(userDetails: z.infer<typeof ForgotPasswordFormSchema>) {
    try {
        const validatedFields = ForgotPasswordFormSchema.safeParse(userDetails);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors
            }
        }

        await createUserPasswordResetRequest(userDetails);
    } catch (errors) {
        return errors;
    }
}