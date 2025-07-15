import mongoose from "mongoose";
import { User } from "./userModel";

export interface TicketType extends mongoose.Document {
    name: string,
    identifier: string,
    description: string,
    createdBy: mongoose.Types.ObjectId | User,
    updatedBy:  mongoose.Types.ObjectId | User,
}

const TicketTypeSchema = new mongoose.Schema<TicketType>({
    name: {
        type: String,
        default: ""
    },
    identifier: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
})

export default mongoose.models.TicketType || mongoose.model<TicketType>("TicketType", TicketTypeSchema);