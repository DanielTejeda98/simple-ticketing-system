import { z } from "zod"
import RoleFormSchema from "../components/Access/RoleForm/RoleFormSchema"
import dbConnect from "../utils/dbConnect"
import permissionsModel, { Permissions } from "../models/permissionsModel";
import mongoose from "mongoose";
import createLogEvent, { LOGGER_EVENTS } from "../lib/logger";
import userModel from "../models/userModel";
import { checkAbilityServer } from "../utils/checkAbilityServer";
import { conditions } from "../lib/appAbility";

export const createPermission = async (newPermission: z.infer<typeof RoleFormSchema>) => {
    const { name, creator, updator, ...permissions} = newPermission;

    if(!checkAbilityServer("update-any", "update", "permissions")) {
        throw new Error("User does not have permissions for this action!")
    }

    const rules = convertPermissionFormToRawRules(permissions)
    
    try {
        await dbConnect();

        await permissionsModel.create({
            name: name,
            permissions: JSON.stringify(rules),
            createdBy: new mongoose.Types.ObjectId(creator),
            updatedBy: updator ? new mongoose.Types.ObjectId(updator) : null
        })

        createLogEvent({who: new mongoose.Types.ObjectId(newPermission.creator), what: LOGGER_EVENTS.permissionCreated, data: JSON.stringify({name, permissions})})

        return true;
    } catch (error) {
        throw error;
    }
}

export const updatePermission = async (id: string, newPermission: z.infer<typeof RoleFormSchema>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, creator, updator, ...permissions} = newPermission;

    if(!checkAbilityServer("update-any", "update", "permissions")) {
        throw new Error("User does not have permissions for this action!")
    }

    const rules = convertPermissionFormToRawRules(permissions)
    
    try {
        await dbConnect();

        await permissionsModel.findOneAndUpdate({_id: id}, {
            name,
            permissions: JSON.stringify(rules),
            updator: new mongoose.Types.ObjectId(updator),
        })

        createLogEvent({who: new mongoose.Types.ObjectId(updator), what: LOGGER_EVENTS.permissionUpdated, data: JSON.stringify({name, permissions})})

        return true;
    } catch (error) {
        throw error;
    }
}

export const deletePermission = async (id: string, user: string) => {
    try {
        await dbConnect();

        if(!checkAbilityServer("delete-any", "delete", "permissions")) {
            throw new Error("User does not have permissions for this action!")
        }

        await permissionsModel.findOneAndDelete({_id: id});

        createLogEvent({who: new mongoose.Types.ObjectId(user), what: LOGGER_EVENTS.permissionDeleted, data: JSON.stringify({id})})
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

export const getPermission = async (id: string): Promise<Permissions|null> => {
    try {
        await dbConnect();

        const foundPermission = await permissionsModel.findById(id)
        .populate({
            path: "createdBy",
            model: userModel
        }).populate({
            path: "updatedBy",
            model: userModel
        }).exec();

        return foundPermission;
    } catch (error) {
        throw error;
    }
}

const convertPermissionFormToRawRules = (permissions: { [x: string]: { [x: string]: string | boolean }; }) => {
    const permissionsArray: { action: string, subject: string, conditions?: unknown}[] = [] as { action: string, subject: string, conditions?: unknown}[];
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Object.keys(permissions).forEach((key: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Object.keys(permissions[key as keyof typeof permissions]).forEach((action: string)  => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (permissions[key][action]) {
                const rule = {action, subject: key} as { action: string, subject: string, conditions?: unknown}
                if (!action.includes("any")) {
                    // Check if we have a condition for this action
                    const _conditions = conditions[key as keyof typeof conditions];
                    if (_conditions && _conditions[action as keyof typeof _conditions]) {
                        rule.conditions = _conditions[action as keyof typeof _conditions];
                    }
                }
                permissionsArray.push(rule);
            }

        })
    })

    return permissionsArray;
}