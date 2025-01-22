import mongoose from "mongoose";
import { User } from "./userModel";

export interface Permissions extends mongoose.Document {
    name: string,
    permissions: string,
    assignedUsersCount: 0,
    createdBy: mongoose.Types.ObjectId | User,
    updatedBy:  mongoose.Types.ObjectId | User,
}

const PermissionsSchema = new mongoose.Schema<Permissions>({
    name: {
        type: String,
        default: ""
    },
    permissions: {
        type: String,
        default: ""
    },
    assignedUsersCount: {
        type: Number,
        default: 0
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

export default mongoose.models.Permissions || mongoose.model<Permissions>("Permissions", PermissionsSchema);