import { z } from "zod";

const NewTicketFormSchema = z.object({
    number: z.string().min(1),
    caller: z.string().min(1),
    project: z.string().min(1),
    category: z.string().min(1),
    contactType: z.string().min(1),
    state: z.string().min(1),
    impact: z.string().min(1),
    urgency: z.string().min(1),
    priority: z.string().min(1),
    assignedTo: z.string().min(1),
    shortDescription: z.string().min(1, {
        message: "Short description must contain at least 1 character"
    }),
    description: z.string().optional(),
})

export default NewTicketFormSchema;