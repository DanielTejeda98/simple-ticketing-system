"use client"
import RoleForm from "@/app/components/Access/RoleForm/RoleForm";
import { Button } from "@/app/components/ui/button";
import { AppAbility } from "@/app/lib/appAbility";
import { AbilityContext } from "@/app/providers/AccessProvider";
import { checkCreateAccessWithAbility } from "@/app/utils/checkAbility";
import Link from "next/link";
import { useContext } from "react";

export default function NewRolePage () {

    const ability = useContext(AbilityContext) as AppAbility;
    checkCreateAccessWithAbility(ability, "permissions");

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">New Role</h1>
                <p className="text-lg md:text-xl text-transparent">Create a new role</p>
            </div>
            <Link href="/access" className="my-3 w-fit"><Button type="button">Back to Access</Button></Link>

            <RoleForm />

        </main>
    )
}