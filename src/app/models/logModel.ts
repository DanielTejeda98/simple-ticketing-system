import mongoose from "mongoose";

export interface Log extends mongoose.Document {
    who: mongoose.Types.ObjectId,
    what: string,
    toWhom: mongoose.Types.ObjectId,
    data: string,
    timestamp: Date
}

const LogSchema = new mongoose.Schema<Log>({
    who: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    what: {
        type: String,
        default: ""
    },
    toWhom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    data: {
        type: String,
        default: ""
    },
    timestamp: {
        type: Date
    }
})

export default mongoose.models.Log || mongoose.model<Log>("Log", LogSchema);