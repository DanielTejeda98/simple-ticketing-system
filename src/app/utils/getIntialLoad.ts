import { getServerSession } from "next-auth"
import { authOptions } from "../config/authOptions"
import { getUserPermissions, isThereUsers } from "../controllers/userController"
import { redirect } from "next/navigation"
import { createAbility } from "../lib/appAbility"

export interface getIntitialLoadOptions {
    skipCheckInitialization?: boolean
}

export const getInitialLoad = async (
    {
        skipCheckInitialization = false,
    }: getIntitialLoadOptions) => {
    //Check if this is the initialization
    const existsUsers = await isThereUsers();
    if(!skipCheckInitialization && !existsUsers) {
        redirect("/initialization");
    }
    // We are at the initialization page but there already exists users in the
    // database, we push back to login
    if (skipCheckInitialization && existsUsers) {
        redirect('/');
    }

    const session = await getServerSession(authOptions)
    let permissions = null;
    if (session && session.user) {
        permissions = await getUserPermissions(session.user.id);
    }
    return {
        props: {
            session: await getServerSession(authOptions),
            permissions: permissions
        }
    }
}