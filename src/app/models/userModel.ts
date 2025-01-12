import mongoose from "mongoose";

export interface User extends mongoose.Document {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    title: string;
    joined: Date;
    disabled: boolean;
    access: string[];
    avatar: string;
    resetToken: string;
    resetTokenExpire: Date;
}

const UserSchema = new mongoose.Schema<User>({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: ""
    },
    joined: {
        type: Date,
        default: new Date()
    },
    access: {
        type: [String]
    },
    avatar: {
        type: String,
        default: ""
    },
    resetToken: {
        type: String
    },
    resetTokenExpire: {
        type: Date
    }
})

export default mongoose.models.User || mongoose.model<User>("User", UserSchema);