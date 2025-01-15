"use server"

import { redirect } from "next/navigation";
import { z } from "zod";
import { createPermission } from "../controllers/permissionsController";
import NewRoleFormSchema from "../components/Access/NewRoleForm/NewRoleFormSchema";

export async function NewPermission(newPermission: z.infer<typeof NewRoleFormSchema>) {
    try {
        await createPermission(newPermission);
    } catch (error) {
        console.log(error)
        return error;
    }
    
    redirect('/access');
}