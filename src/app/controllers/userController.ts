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
            access: isInitialization ? ["superadmin"] : []
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