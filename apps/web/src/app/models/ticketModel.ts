import mongoose from "mongoose";
import { User } from "./userModel";
import { Project } from "./projectModel";

export interface Ticket extends mongoose.Document {
    number: string;
    project: mongoose.Types.ObjectId | string | Project | null;
    caller: mongoose.Types.ObjectId | User | string | null;
    contactType: "self-service" | "email" | "phone" | "in-person";
    state: "new" | "in-progress" | "on-hold" | "work-completed" | "resolved";
    impact: "1" | "2" | "3" | "4";
    urgency: "1" | "2" | "3" | "4";
    priority: "1" | "2" | "3" | "4";
    assignedTo: mongoose.Types.ObjectId | User | string | null;
    category: string;
    shortDescription: string;
    description: string;
    notes: {
        user: string;
        content: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    attachments: {
        id: string;
        filename: string;
        url: string;
        createdAt: Date;
    }[];
    resolutionInformation: {
        resolutionSummary: string;
    };
}

const ticketSchema = new mongoose.Schema<Ticket>({
    number: {
        type: String,
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    caller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    contactType: {
        type: String,
        enum: ["self-service", "email", "phone", "in-person"],
        default: "email"
    },
    state: {
        type: String,
        enum: ["new", "in-progress", "on-hold", "work-completed", "resolved"],
        default: "new"
    },
    impact: {
        type: String,
        enum: ["1", "2", "3", "4"],
        default: "3"
    },
    urgency: {
        type: String,
        enum: ["1", "2", "3", "4"],
        default: "3"
    },
    priority: {
        type: String,
        enum: ["1", "2", "3", "4"],
        default: "3"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    category: {
        type: String,
        default: ""
    },
    shortDescription: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    notes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        content: {
            type: String,
            required: true,
            minlength: 1
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    attachments: [{
        id: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    resolutionInformation: {
        resolutionSummary: {
            type: String,
            required: true,
            minlength: 1
        }
    }
})

export default mongoose.models.Ticket || mongoose.model<Ticket>("Ticket", ticketSchema);