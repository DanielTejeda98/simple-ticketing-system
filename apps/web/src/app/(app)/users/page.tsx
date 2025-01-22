import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import Link from "next/link";
import { getAllUsers } from "@/app/controllers/userController";
import { User } from "@/app/models/userModel";
import UserRow from "@/app/components/Users/UsersRow";
import mongoose from "mongoose";

export default async function UsersPage () {

    const users = await getAllUsers() as User[];

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">User Management</h1>
                <p className="text-lg md:text-xl text-transparent">Manage users and what they can do</p>
            </div>
            <div className="flex w-full justify-between">
                <Link href="/users/new" className="my-3 w-fit"><Button>Create new User</Button></Link>
            </div>
            <Table>
                <TableCaption>List of Users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Account Status</TableHead>
                        <TableHead>Role</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        users.map((user: User) => (<UserRow key={(user._id as mongoose.Types.ObjectId).toString()} user={JSON.parse(JSON.stringify(user))}/>))
                    }
                </TableBody>
            </Table>
        </main>
    )
}