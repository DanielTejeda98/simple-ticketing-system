"use server"

import { z } from "zod";
import ResetPasswordFormSchema from "../components/Accounts/ResetPasswordForm/ResetPasswordFormSchema";
import { resetUserPassword } from "../controllers/userController";

export async function ResetUserPassword(token: string, userDetails: z.infer<typeof ResetPasswordFormSchema>): Promise<boolean|{errors: {}}|Error> {
    try {
        const validatedFields = ResetPasswordFormSchema.safeParse(userDetails);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors
            }
        }

        return await resetUserPassword(token, userDetails);
    } catch (errors) {
        return errors as Error;
    }
}