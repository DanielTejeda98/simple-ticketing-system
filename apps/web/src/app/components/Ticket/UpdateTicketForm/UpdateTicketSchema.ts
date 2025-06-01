import { z } from "zod";
import NewTicketFormSchema from "../NewTicketForm/NewTicketFormSchema";

export const NoteSchema = z.object({
    _id: z.string().optional(),
    user: z.string(),
    content: z.string().min(1, {
        message: "Note content must contain at least 1 character"
    }),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional()
})

const UpdateTicketFormSchema = NewTicketFormSchema.extend({
    notes: z.array(NoteSchema).optional(),
    attachments: z.array(z.object({
        id: z.string(),
        filename: z.string(),
        url: z.string().url(),
        createdAt: z.string().datetime().optional()
    })).optional(),
    resolutionInformation: z.object({
        resolutionSummary: z.string().min(1, {
            message: "Resolution summary must contain at least 1 character"
        }).optional()
    }).optional(),
})

export type Note = z.infer<typeof NoteSchema>;
export type UpdateTicketFormSchema = z.infer<typeof UpdateTicketFormSchema>;

export default UpdateTicketFormSchema;