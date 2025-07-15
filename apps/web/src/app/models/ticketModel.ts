import mongoose from "mongoose";
import { User } from "./userModel";
import { Project } from "./projectModel";
import { TicketType } from "./ticketTypeModel";
import counterModel from "./counterModel";

export type ContactType = "self-service" | "email" | "phone" | "in-person";
export type TicketState = "new" | "in-progress" | "on-hold" | "work-completed" | "resolved";
export type TicketImpact = "1" | "2" | "3" | "4";
export type TicketUrgency = "1" | "2" | "3" | "4";
export type TicketPriority = "1" | "2" | "3" | "4";

export interface Ticket extends mongoose.Document {
    number: number;
    type: mongoose.Types.ObjectId | TicketType | string | null;
    project: mongoose.Types.ObjectId | string | Project | null;
    caller: mongoose.Types.ObjectId | User | string | null;
    contactType: ContactType;
    state: TicketState;
    impact: TicketImpact;
    urgency: TicketUrgency;
    priority: TicketPriority;
    assignedTo: mongoose.Types.ObjectId | User | string | null;
    category: string;
    shortDescription: string;
    description: string;
    notes: Note[];
    attachments: Attachment[];
    resolutionInformation: {
        resolutionSummary: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface Note extends mongoose.Document {
    user: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Attachment extends mongoose.Document {
    id: string;
    filename: string;
    url: string;
    createdAt: Date;
}

const ticketSchema = new mongoose.Schema<Ticket>({
    number: {
        type: Number
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TicketType",
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
            minlength: 1
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
})

ticketSchema.index({ number: 1 }, { unique: true });

ticketSchema.pre<Ticket>('save', async function(next) {
    const counter = await counterModel.findByIdAndUpdate({_id: 'ticketNumber'}, { $inc: { seq: 1 } }, { new: true, upsert: true });
    this.number = counter ? counter.seq : 1;
    this.updatedAt = new Date();
    next();
})

export default mongoose.models.Ticket || mongoose.model<Ticket>("Ticket", ticketSchema);