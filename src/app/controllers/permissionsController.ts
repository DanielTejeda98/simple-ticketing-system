import { z } from "zod"
import NewRoleFormSchema from "../components/Access/NewRoleForm/NewRoleFormSchema"
import dbConnect from "../utils/dbConnect"
import permissionsModel, { Permissions } from "../models/permissionsModel";
import mongoose from "mongoose";
import createLogEvent, { LOGGER_EVENTS } from "../lib/logger";
import userModel from "../models/userModel";

export const createPermission = async (newPermission: z.infer<typeof NewRoleFormSchema>) => {
    const { name, creator, ...permissions} = newPermission;

    const permissionsArray: { action: string, subject: string}[] = [] as { action: string, subject: string}[];
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Object.keys(permissions).forEach((key: string) => {
        Object.keys(permissions[key as keyof typeof permissions]).forEach((action: string)  => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (permissions[key][action]) {
                permissionsArray.push({action, subject: key});
            }

        })
    })
    
    try {
        await dbConnect();

        await permissionsModel.create({
            name: name,
            permissions: JSON.stringify(permissionsArray),
            createdBy: new mongoose.Types.ObjectId(creator)
        })

        createLogEvent({who: new mongoose.Types.ObjectId(newPermission.creator), what: LOGGER_EVENTS.permissionCreated, data: JSON.stringify({name, permissions})})

        return true;
    } catch (error) {
        throw error;
    }
}

export const getAllPermissions = async (): Promise<Permissions[]> => {
    
    try {
        await dbConnect();

        const foundPermissions = await permissionsModel.find({})
        .populate({
            path: "createdBy",
            model: userModel
        }).populate({
            path: "updatedBy",
            model: userModel
        }).exec();

        return foundPermissions;
    } catch (error) {
        throw error;
    }
}