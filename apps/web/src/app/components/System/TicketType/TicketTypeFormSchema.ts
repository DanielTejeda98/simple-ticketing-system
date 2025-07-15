import { z } from "zod";

export const TicketTypeFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name must be at most 100 characters"),
    identifier: z.string().min(3, "Identifier must be 3 characters").max(3, "Identifier must be 3 characters").regex(/^[a-zA-Z]+$/, "Identifier can only contain letters").transform(val => val.toUpperCase()),
    description: z.string().max(500, "Description must be at most 500 characters").optional().or(z.literal("")),
});