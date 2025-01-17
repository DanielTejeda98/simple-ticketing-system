import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { getAllPermissions } from "@/app/controllers/permissionsController";
import { Permissions } from "@/app/models/permissionsModel";
import Link from "next/link";
import AccessRow from "@/app/components/Access/AccessRow";

export default async function AccessPage () {

    const roles = await getAllPermissions() as Permissions[];

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">Access Management</h1>
                <p className="text-lg md:text-xl text-transparent">Manage permission roles and what they can do</p>
            </div>
            <div className="flex w-full justify-between">
                <Link href="/access/new" className="my-3 w-fit"><Button>Create new role</Button></Link>
            </div>
            <Table>
                <TableCaption>List of roles</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Assigned Users</TableHead>
                        <TableHead>Last Updated By</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        roles.map((role: Permissions) => (<AccessRow key={role._id!.toString()} role={JSON.parse(JSON.stringify(role))}/>))
                    }
                </TableBody>
            </Table>
        </main>
    )
}