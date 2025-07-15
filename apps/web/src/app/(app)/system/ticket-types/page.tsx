import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { getAllTicketTypes } from "@/app/controllers/ticketTypeController";


export default async function SystemsTicketTypePage () {
    const ticketTypes = await getAllTicketTypes();
    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">Ticket Types</h1>
                <p className="text-lg md:text-xl text-transparent">The types of tickets that can be created</p>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3 px-4 md:px-8 pt-8">
                <div className="flex w-full justify-between">
                    <Link href="/system/ticket-types/new" className="my-3 w-fit"><Button>Create new type</Button></Link>
                </div>
            </div>
            <Table>
                <TableCaption>List of ticket types</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Type Name</TableHead>
                        <TableHead>Type Identifier</TableHead>
                        <TableHead>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        ticketTypes.length > 0 ? ticketTypes.map(type => (
                            <TableRow key={(type._id as string).toString()}>
                                <TableCell><Link href={`/system/ticket-types/${(type._id as string).toString()}`} className="underline">{type.name}</Link></TableCell>
                                <TableCell><code>{type.identifier}</code></TableCell>
                                <TableCell>{type.description ? type.description : <span className="italic text-muted-foreground">No description</span>}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center italic text-muted-foreground p-4">No ticket types found. Create one to get started!</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </main>
    )
}