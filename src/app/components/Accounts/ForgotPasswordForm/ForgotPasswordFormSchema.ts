import { z } from 'zod';

const ForgotPasswordFormSchema = z.object({
    providedIdentification: z.string({
        required_error: "Username or Email is required"
    }).trim().nonempty({ message: "Username or Email is required" })
})

export default ForgotPasswordFormSchema