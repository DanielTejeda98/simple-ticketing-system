import { z } from 'zod';

const EditUserFormSchema = z.object({
    id: z.string(),
    newPassword: z.string({
        required_error: "Password is required"
    }).trim().optional(),
    email: z.string().email({
        message: "Email is invalid, please use a valid email"
    }),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    title: z.string().optional(),
    avatar: z.string().optional(),
    access: z.string(),
    updater: z.string(),
})

export default EditUserFormSchema;