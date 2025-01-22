"use client"

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import EditUserForm from "@/app/components/Users/EditUserForm/EditUserForm";
import { Permissions } from "@/app/models/permissionsModel";
import { User } from "@/app/models/userModel";
import { AbilityContext } from "@/app/providers/AccessProvider";
import { checkAbility } from "@/app/utils/checkAbility";
import handleUnathorized from "@/app/utils/unauthorized";
import mongoose from "mongoose";
import Link from "next/link";
import { useContext } from "react";

export default function EditUserView ({retrievedUser, roles}: {retrievedUser: User, roles: Permissions[]}) {
    const ability = useContext(AbilityContext);

    if(!checkAbility(ability, "update-any", "update", "users")) {
        handleUnathorized();
    }

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">{`${retrievedUser.firstName} ${retrievedUser.lastName}`}</h1>
                <p className="text-lg md:text-xl text-transparent">{retrievedUser.email}</p>
            </div>
            <Badge className="w-fit">ID: {(retrievedUser._id as mongoose.Types.ObjectId).toString()}</Badge>
            <Link href="/users" className="my-3 w-fit"><Button>Back to users</Button></Link>
            
            <EditUserForm user={JSON.parse(JSON.stringify(retrievedUser))} permissions={JSON.parse(JSON.stringify(roles))} />
        </main>
    )
}