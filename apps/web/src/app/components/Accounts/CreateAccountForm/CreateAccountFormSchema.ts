import { z } from 'zod';

const CreateAccountFormSchema = z.object({
    username: z.string({
        required_error: "Username is required"
    }).trim().min(2, {
        message: "Username must be more than 2 characters"
    }).max(20, {
        message: "Username must be less than 20 characters"
    }),
    password: z.string({
        required_error: "Password is required"
    }).trim().min(8, {
        message: "Password must be at least 8 characters"
    }),
    confirmPassword: z.string({
        required_error: "Confirm password is required"
    }).trim().min(8, {
        message: "Confirm Password must be at least 8 characters"
    }),
    email: z.string().email({
        message: "Email is invalid, please use a valid email"
    }),
    confirmEmail: z.string().email({
        message: "Email is invalid, please use a valid email"
    }),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    title: z.string().optional()
}).superRefine(({ email, confirmEmail, password, confirmPassword}, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: "custom",
            message: "Password and Confirm Password do not match.",
            path: ['confirmPassword']
        })
    }

    if (email !== confirmEmail) {
        ctx.addIssue({
            code: "custom",
            message: "Email and Confirm Email do not match.",
            path: ['confirmEmail']
        })
    }
})

export default CreateAccountFormSchema;