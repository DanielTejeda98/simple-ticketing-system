import TicketTableRow from "@/app/components/Ticket/TicketTableRow";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import Link from "next/link";
import { getAllTickets } from "@/app/controllers/ticketController";
import { Ticket } from "@/app/models/ticketModel";

/**
 * TODO
 * - Add a filter to the table
 */

export default async function TicketsPage () {
    const tickets = JSON.parse(JSON.stringify(await getAllTickets())) as Ticket[];
    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">Tickets</h1>
                <p className="text-lg md:text-xl text-transparent">View all tickets in the system</p>
            </div>
            <div className="flex w-full justify-between">
                <Link href="/ticket/new" className="my-3 w-fit"><Button>Create new ticket</Button></Link>
            </div>
            <Table>
                <TableCaption>List of tickets</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Number</TableHead>
                        <TableHead>Opened</TableHead>
                        <TableHead>Short Description</TableHead>
                        <TableHead>Caller</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Assigned to</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead>Updated by</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TicketTableRow key={ticket._id!.toString()} ticket={ticket} />
                    ))}
                </TableBody>
            </Table>
        </main>
    )
}
