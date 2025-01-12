import { z } from 'zod';

const NewProjectFormSchema = z.object({
    creator: z.string(),
    name: z.string().min(1, {
        message: "Project name must contain at least 1 character"
    }),
    description: z.string().optional()
})

export default NewProjectFormSchema;