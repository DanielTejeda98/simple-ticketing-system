import logModel from "../models/logModel";
import userModel from "../models/userModel";
import dbConnect from "../utils/dbConnect"

export const getAudits = async () => {
    try {
        await dbConnect();
        return logModel.find({})
        .populate({
            path: "who",
            model: userModel,
            select: "username firstName lastName avatar title email"
        })
        .populate({
            path: "toWhom",
            model: userModel,
            select: "username firstName lastName avatar title email"
        })
        .sort({ timestamp: -1})
        .exec();
    } catch (error) {
        throw error;
    }
}