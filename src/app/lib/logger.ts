import mongoose from "mongoose"
import dbConnect from "../utils/dbConnect"
import logModel from "../models/logModel"

export type LogEvent = {
    who?: mongoose.Types.ObjectId,
    what?: string,
    toWhom?: mongoose.Types.ObjectId,
    data?: string,
    timestamp?: Date
}

export const LOGGER_EVENTS = {
    emailSent: "Email sent",
    userCreated: "User was created",
    userPasswordResetRequest: "User requested password reset",
    userPasswordResetSuccessful: "reset password successfully",
    userLogin: "user logged in",
    projectCreated: "created project",
    projectUpdated: "updated project",
    projectArchived: "archived project"
}

const createLogEvent = async (event: LogEvent) => {
    try {
        await dbConnect();

        await logModel.create({
            timestamp: new Date(),
            ...event
        })
    } catch (error) {
        console.error("Error Logging: ", error)
    }
}

export default createLogEvent;