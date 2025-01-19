import { z } from "zod";
import userModel, { User } from "../models/userModel";
import dbConnect from "../utils/dbConnect"
import CreateAccountFormSchema from "../components/Accounts/CreateAccountForm/CreateAccountFormSchema";
import { hash } from "../utils/passwordHasher";
import ForgotPasswordFormSchema from "../components/Accounts/ForgotPasswordForm/ForgotPasswordFormSchema";
import generateRandomToken from "../utils/randomToken";
import { sendMail } from "../lib/mailer";
import PasswordResetEmailTemplate from "../emails/passwordResetRequest";
import ResetPasswordFormSchema from "../components/Accounts/ResetPasswordForm/ResetPasswordFormSchema";
import PasswordResetSuccessfulEmailTemplate from "../emails/passwordResetSuccessful";
import WelcomeEmailTemplate from "../emails/welcome";
import createLogEvent, { LOGGER_EVENTS } from "../lib/logger";
import mongoose from "mongoose";
import permissionsModel from "../models/permissionsModel";
import EditUserFormSchema from "../components/Users/EditUserForm/EditUserFormSchema";
import PasswordResetByAdminEmailTemplate from "../emails/passwordChanged";
import { checkAbilityServer } from "../utils/checkAbilityServer";

export const isThereUsers = async () => {
    await dbConnect();

    try { 
        const existingUser = await userModel.findOne({});
        return !!existingUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const createUser = async (isInitialization: boolean = false, user: z.infer<typeof CreateAccountFormSchema>) => {
    try {
        await dbConnect();
            
        // See if any users already exist with that username or password
        const existingUser = await userModel.findOne({$or: [
            { username: {
                $regex: new RegExp(user.username, "i")
            } },
            { email: {
                $regex: new RegExp(user.email, "i")
            } }
        ]})
    
        if (existingUser) {
            return {
                error: "A user already exists"
            }
        }
    
        await userModel.create({
            username: user.username,
            password: await hash(user.password),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            title: user.title,
            joined: new Date(),
            access: isInitialization ? "superadmin" : []
        })

        createLogEvent({what: LOGGER_EVENTS.userCreated, data: JSON.stringify({username: user.username})});

        const userName = user.firstName + " " + user.lastName;

        sendMail({
            to: user.email,
            subject: "Welcome | Simple Ticketing System",
            html: WelcomeEmailTemplate(userName)
        })

        return true;
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (user: z.infer<typeof EditUserFormSchema>, fromUserManagement: boolean) => {
    let notifyOfPasswordChange = false;
    try {
        await dbConnect();

        if(!checkAbilityServer(user.updater, "update-any", "update", "projects")) {
            throw new Error("User does not have permissions for this action!");
        }

        // See if any users already exist with that username or password
        const findUserAndUserAssociatedEmail = await findAllUsersByEmailOrId(user.id, user.email);

        // If we get more than one result, we know that the email might be associated to another user
        if (findUserAndUserAssociatedEmail.length > 1) {
            throw new Error("Email assigned to another user");
        }
        const foundUser = findUserAndUserAssociatedEmail.at(0);
    
        if (!foundUser) {
            throw new Error("No user found");
        }

        foundUser.email = user.email;
        foundUser.firstName = user.firstName;
        foundUser.lastName = user.lastName;
        foundUser.title = user.title || "";
        foundUser.avatar = user.avatar || "";
        
        // These attributes should only be changed via user management
        if (fromUserManagement) {
            foundUser.access = new mongoose.Types.ObjectId(user.access);
        }

        if (user.newPassword) {
            foundUser.password = await hash(user.newPassword);
            // Notify user of the new password
            notifyOfPasswordChange = true;
        }

        await foundUser.save();

        createLogEvent({
            who: new mongoose.Types.ObjectId(user.updater), 
            what: LOGGER_EVENTS.userUpdated, 
            toWhom: new mongoose.Types.ObjectId(user.id)
        });

        const userName = user.firstName + " " + user.lastName;
        if (notifyOfPasswordChange && user.newPassword) {
            sendMail({
                to: user.email,
                subject: "Password Changed | Simple Ticketing System",
                html: fromUserManagement ? PasswordResetByAdminEmailTemplate(userName, user.newPassword) : PasswordResetSuccessfulEmailTemplate(userName)
            })
        }

        return true;
    } catch (error) {
        throw error;
    }
}

export const createUserPasswordResetRequest = async (userDetails: z.infer<typeof ForgotPasswordFormSchema>) => {
    try {
        await dbConnect();

        const user = await findUserByEmailOrUsername(userDetails.providedIdentification);

        if (!user) {
            throw new Error("No user found");
        }
        const token = generateRandomToken(16);
        user.resetToken = token;
        const tokenExpiration = new Date().setTime(new Date().getTime() + (3600 * 1000));
        user.resetTokenExpire = new Date(tokenExpiration);

        await user.save();

        const userName = user.firstName + " " + user.lastName;

        createLogEvent({who: user._id as mongoose.Types.ObjectId, what: LOGGER_EVENTS.userPasswordResetRequest });

        sendMail({
            to: user.email,
            subject: "Simple Ticketing System - Password Reset Request",
            html: PasswordResetEmailTemplate(token, userName)
        })
        
    } catch (error) {
        throw error;
    }
}

export const isValidResetToken = async (token: string) => {
    try {
        const user = await userModel.findOne({$and: [
            {
                resetToken: token
            },
            {
                resetTokenExpire: {
                    $gt: new Date()
                }
            }
        ]})

        if (!user) {
            throw new Error("Token is invalid or exipred");
        }

        return true;
    } catch (error) {
        throw error;
    }
}

export const resetUserPassword = async (token: string, details: z.infer<typeof ResetPasswordFormSchema>) => {
    try {
        const user = await userModel.findOne({$and: [
            {
                resetToken: token
            },
            {
                resetTokenExpire: {
                    $gt: new Date()
                }
            }
        ]})

        if (!user) {
            throw new Error("Token is invalid or exipred");
        }

        user.password = await hash(details.password);
        user.resetToken = "";
        user.resetTokenExpire = null;
        await user.save();

        createLogEvent({who: user._id as mongoose.Types.ObjectId, what: LOGGER_EVENTS.userPasswordResetSuccessful });

        const userName = user.firstName + " " + user.lastName;

        sendMail({
            to: user.email,
            subject: "Password Reset Successfully",
            html: PasswordResetSuccessfulEmailTemplate(userName)
        })

        return true;
    } catch (error) {
        throw error;
    }
} 

export const getAllUsers = async () => {
    await dbConnect();

    try { 
        const users = await userModel.find({}).select("email firstName lastName avatar access")
        .populate({
            path: "access",
            model: permissionsModel,
            select: "name"
        })
        .exec();
        return users;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUser = async (id: string): Promise<User|null> => {
    await dbConnect();

    try { 
        const user = await userModel.findOne({_id: new mongoose.Types.ObjectId(id)}).select("email firstName lastName avatar access")
        .populate({
            path: "access",
            model: permissionsModel,
            select: "name"
        }).exec();
        return user;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUsers = async (id: string[]): Promise<User[]|null> => {
    await dbConnect();

    const ObjectIds = id.map(id => new mongoose.Types.ObjectId(id));

    try { 
        const users = await userModel.find({_id: { $in: ObjectIds }}).select("email firstName lastName avatar").exec();
        return users;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getUserPermissions = async (id: string) => {
    try {
        await dbConnect();

        const user = await userModel.findOne({_id: new mongoose.Types.ObjectId(id)})
        .populate({
            path: "access",
            model: permissionsModel
        }).exec();

        return JSON.parse(user.access.permissions);
    } catch (error) {
        throw error;
    }
}

export const getUserAvatar = async (id: string) => {
    try {
        await dbConnect();

        const user = await userModel.findOne({_id: new mongoose.Types.ObjectId(id)}, "avatar");

        return user.avatar;
    } catch (error) {
        throw error;
    }
}

const findUserByEmailOrUsername = async (providedIdentification: string): Promise<User|null> => {
    return await userModel.findOne({$or: [
        { username: {
            $regex: new RegExp(providedIdentification, "i")
        } },
        { email: {
            $regex: new RegExp(providedIdentification, "i")
        } }
    ]})
}

const findAllUsersByEmailOrId = async (id: string, email: string): Promise<User[]> => {
    return await userModel.find({$or: [
        { _id: new mongoose.Types.ObjectId(id) },
        { email: {
            $regex: new RegExp(email, "i")
        } }
    ]})
}
