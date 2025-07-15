import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";

export default async function SystemsPage () {

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">System Management</h1>
                <p className="text-lg md:text-xl text-transparent">Manage system settings</p>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 px-4 md:px-8 pt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>Manage ticket types</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Link href={"/system/ticket-types"}><Button type="button">Manage Ticket Types</Button></Link>
                    </CardFooter>
                </Card>
            </div>
        </main>
    )
}