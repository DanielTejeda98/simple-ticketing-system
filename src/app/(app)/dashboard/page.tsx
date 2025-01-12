"use client"
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useSession } from "next-auth/react"
import Link from "next/link";

export default function Dashboard () {
    const { data } = useSession();
    const user = data!.user!;
    return (
        <main className="flex flex-col w-full">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text px-4 md:px-8 mt-6 md:mt-[10vh] max-h-fit">
                <h1 className="text-4xl md:text-8xl text-transparent">Hi, {user.firstName}</h1>
                <p className="text-xl md:text-3xl text-transparent">What are you looking to do today?</p>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 px-4 md:px-8 pt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Create new ticket</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Create a new ticket for an issue or a request</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button type="button">New Ticket</Button>
                    </CardFooter>
                </Card>

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

                <Card>
                    <CardHeader>
                        <CardTitle>Check existing ticket</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Find information on an existing ticket</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button type="button">Check Ticket</Button>
                    </CardFooter>
                </Card>

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

                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Manage users and their accounts</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button type="button">User Management</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Access Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Manage roles in the system and assign roles to users</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button type="button">Access Management</Button>
                    </CardFooter>
                </Card>

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

                <Card>
                    <CardHeader>
                        <CardTitle>System Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Manage system settings</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button type="button">System Settings</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="w-full px-8 pt-8">
                <h2 className="text-lg md:text-2xl">Recents</h2>
            </div>
        </main>
    )
}