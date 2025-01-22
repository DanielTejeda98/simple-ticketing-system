import { z } from 'zod';

const ProjectFormSchema = z.object({
    name: z.string().min(1, {
        message: "Project name must contain at least 1 character"
    }),
    slug: z.string(),
    description: z.string(),
    boughtWorkHours: z.number(),
    leadResource: z.string().or(z.undefined()),
    updater: z.string()
})

export default ProjectFormSchema;