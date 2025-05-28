import { z } from "zod";

const NewTicketFormSchema = z.object({
    number: z.string().min(1),
    caller: z.string().min(1),
    project: z.string().min(1),
    category: z.string().min(1),
    contactType: z.enum(["self-service", "email", "phone", "in-person"]),
    state: z.enum(["new", "in-progress", "on-hold", "work-completed", "resolved"]),
    impact: z.enum(["1", "2", "3", "4"]),
    urgency: z.enum(["1", "2", "3", "4"]),
    priority: z.enum(["1", "2", "3", "4"]),
    assignedTo: z.string().min(1),
    shortDescription: z.string().min(1, {
        message: "Short description must contain at least 1 character"
    }),
    description: z.string().optional(),
})

export default NewTicketFormSchema;