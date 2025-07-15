"use client"
import ShowWhen from "@/app/components/Global/Show";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { AbilityContext } from "@/app/providers/AccessProvider";
import { checkAbility } from "@/app/utils/checkAbility";
import { useSession } from "next-auth/react"
import Link from "next/link";
import { useContext } from "react";

export default function Dashboard () {
    const { data } = useSession();
    const user = data!.user!;
    const ability = useContext(AbilityContext)

    return (
        <main className="flex flex-col w-full">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text px-4 md:px-8 mt-6 md:mt-[10vh] max-h-fit">
                <h1 className="text-4xl md:text-8xl text-transparent">Hi, {user.firstName}</h1>
                <p className="text-xl md:text-3xl text-transparent">What are you looking to do today?</p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 px-4 md:px-8 pt-8">
                <ShowWhen condition={checkAbility(ability, "create-any", "create", "tickets")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create new ticket</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Create a new ticket for an issue or a request</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Link href={"/ticket/new"}><Button type="button">New Ticket</Button></Link>
                        </CardFooter>
                    </Card>
                </ShowWhen>

                <ShowWhen condition={checkAbility(ability, "update-any", "update", "tickets")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Work on ticket</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Time work on tickets assigned to you</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button type="button">Work on Ticket</Button>
                        </CardFooter>
                    </Card>
                </ShowWhen>

                <ShowWhen condition={checkAbility(ability, "read-any", "read", "tickets")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Check existing tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Find information on an existing tickets</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Link href={"/ticket"}><Button type="button">Check Tickets</Button></Link>
                        </CardFooter>
                    </Card>
                </ShowWhen>

                <ShowWhen condition={checkAbility(ability, "read-any", "read", "projects")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Manage projects and the users assigned to projects</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Link href={"/projects"}><Button type="button">Project Management</Button></Link>
                        </CardFooter>
                    </Card>
                </ShowWhen>

                <ShowWhen condition={checkAbility(ability, "read-any", "read", "users")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Manage users and their accounts</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Link href={"/users"}><Button type="button">User Management</Button></Link>
                        </CardFooter>
                    </Card>
                </ShowWhen>

                <ShowWhen condition={checkAbility(ability, "read-any", "read", "permissions")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Access Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Manage roles in the system and assign roles to users</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Link href={"/access"}><Button type="button">Access Management</Button></Link>
                        </CardFooter>
                    </Card>
                </ShowWhen>
                <ShowWhen condition={checkAbility(ability, "read-any", "read", "audit")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Audit Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Check system logs</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Link href={"/audit"}><Button type="button">Audit</Button></Link>
                        </CardFooter>
                    </Card>
                </ShowWhen>
                <ShowWhen condition={checkAbility(ability, "read-any", "read", "system")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>System Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Manage system settings</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Link href={"/system"}><Button type="button">System Settings</Button></Link>
                        </CardFooter>
                    </Card>
                </ShowWhen>
            </div>

            <div className="w-full px-8 pt-8">
                <h2 className="text-lg md:text-2xl">Recents</h2>
            </div>
        </main>
    )
}