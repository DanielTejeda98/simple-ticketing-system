import { z } from "zod";
import NewTicketFormSchema from "../NewTicketForm/NewTicketFormSchema";

const UpdateTicketFormSchema = NewTicketFormSchema.extend({
    notes: z.array(z.object({
        user: z.string(),
        content: z.string().min(1, {
            message: "Note content must contain at least 1 character"
        }),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime()
    })).optional(),
    attachments: z.array(z.object({
        id: z.string(),
        filename: z.string(),
        url: z.string().url(),
        createdAt: z.string().datetime()
    })).optional(),
    resolutionInformation: z.object({
        resolutionSummary: z.string().min(1, {
            message: "Resolution summary must contain at least 1 character"
        }).optional()
    }).optional(),
})

export default UpdateTicketFormSchema;