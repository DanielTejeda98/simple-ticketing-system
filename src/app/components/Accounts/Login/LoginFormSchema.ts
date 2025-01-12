import { z } from 'zod';

const LoginFormSchema = z.object({
    providedIdentifier: z.string({
        required_error: "Username or email required"
    }).trim().nonempty({ message: "Username or email is required" }),
    password: z.string({
        required_error: "Password is required"
    }).trim().nonempty({ message: "Password is required" })
})

export default LoginFormSchema