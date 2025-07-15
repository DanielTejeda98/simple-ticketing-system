import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { getAllTickets } from "@/app/controllers/ticketController";
import { TicketType } from "@/app/models/ticketTypeModel";
import formatTicketNumber from "@/app/utils/formatTicketNumber";
import Link from "next/link";

/**
 * TODO
 * - Add a filter to the table 
 */
export default async function ProjectsPage () {
    const tickets = await getAllTickets();

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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        tickets?.map(ticket => (
                            <TableRow key={ticket._id!.toString()} className="hover:bg-slate-100">
                                <TableCell>
                                    <Link href={`/ticket/${ticket._id}`} className="text-blue-500 hover:underline">{formatTicketNumber(ticket.number, (ticket.type as TicketType))}</Link>
                                </TableCell>
                                <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{ticket.shortDescription}</TableCell>
                                <TableCell>{ticket.caller?.firstName} {ticket.caller?.lastName}</TableCell>
                                <TableCell>{ticket.priority}</TableCell>
                                <TableCell>{ticket.state}</TableCell>
                                <TableCell>{ticket.project?.name}</TableCell>
                                <TableCell>{ticket.category}</TableCell>
                                <TableCell>{ticket.assignedTo?.firstName} {ticket.assignedTo?.lastName}</TableCell>
                            </TableRow>
                        )) ?? "No tickets found"
                    }
                </TableBody>
            </Table>
        </main>
    )
}