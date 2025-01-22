import { z } from 'zod';

const ResetPasswordFormSchema = z.object({
    password: z.string({
        required_error: "Password is required"
    }).min(8, {message: "Password must contain at least 8 characters"}).trim().nonempty({ message: "Password is required" }),
    confirmPassword: z.string({
        required_error: "Confirm Password is required"
    }).min(8, {message: "Confirm Password must contain at least 8 characters"}).trim().nonempty({ message: "Password is required" })
}).superRefine(({ password, confirmPassword}, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Password and Confirm Password do not match.",
            path: ['confirmPassword']
        })
    }
})

export default ResetPasswordFormSchema