"use server"

import { redirect } from "next/navigation";
import { z } from "zod";
import { createPermission, deletePermission, updatePermission } from "../controllers/permissionsController";
import RoleFormSchema from "../components/Access/RoleForm/RoleFormSchema";
import { getServerSession } from "next-auth";
import { authOptions } from "../config/authOptions";

export async function NewPermission(newPermission: z.infer<typeof RoleFormSchema>) {
    try {
        await createPermission(newPermission);
    } catch (error) {
        console.log(error)
        return error;
    }
    
    redirect('/access');
}

export async function UpdatePermission(id: string, update: z.infer<typeof RoleFormSchema>) {
    try {
        await updatePermission(id, update);
    } catch (error) {
        console.log(error);
        return error;
    }

    redirect('/access');
}

export async function DeletePermission (id: string) {
    const session = await getServerSession(authOptions);
    
    try {
        await deletePermission(id, session?.user.id || "");
    } catch (error) {
        console.log(error);
        return error;
    }

    redirect('/access');
}