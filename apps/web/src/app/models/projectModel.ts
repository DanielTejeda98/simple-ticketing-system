import mongoose from "mongoose";
import { User } from "./userModel";

export interface Project extends mongoose.Document {
    name: string,
    slug: string,
    description: string,
    tickets: mongoose.Types.Array<mongoose.Schema.Types.ObjectId>,
    boughtWorkHours: number,
    totalWorkedHours: number,
    leadResource: mongoose.Types.ObjectId | User,
    owningClient: mongoose.Types.ObjectId | User,
    members: mongoose.Types.Array<mongoose.Schema.Types.ObjectId> | mongoose.Types.Array<User>,
    archived: boolean,
    createdBy: mongoose.Schema.Types.ObjectId,
    updatedBy: mongoose.Schema.Types.ObjectId
}

const projectSchema = new mongoose.Schema<Project>({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ""
    },
    tickets: {
        type: []
    },
    boughtWorkHours: {
        type: Number,
        default: 0
    },
    totalWorkedHours: {
        type: Number,
        default: 0
    },
    leadResource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    owningClient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    archived: {
        type: Boolean,
        default: false
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

export default mongoose.models.Project || mongoose.model<Project>("Project", projectSchema);