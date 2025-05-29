import UpdateTicketForm from "@/app/components/Ticket/UpdateTicketForm/UpdateTicketForm";
import { Button } from "@/app/components/ui/button";
import { authOptions } from "@/app/config/authOptions";
import { getAllProjects } from "@/app/controllers/projectController";
import { getTicketById } from "@/app/controllers/ticketController";
import { getAllUsers, getUserPermissions } from "@/app/controllers/userController";
import { User } from "@/app/models/userModel";
import { checkUpdateAccess } from "@/app/utils/checkAbility";
import { handleNotFound } from "@/app/utils/redirectHandlers";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function UpdateTicketPage ({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    const permissions = await getUserPermissions(user?.id || "");
    checkUpdateAccess(permissions, "tickets");

    const retrievedTicket = await getTicketById(id, user?.id || "");
    if (!retrievedTicket) {
        handleNotFound();
    }

    const retrievedUsers = await getAllUsers() as User[]
    const projects = await getAllProjects();

    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">New Ticket</h1>
                <p className="text-lg md:text-xl text-transparent">Create a new ticket</p>
            </div>
            <Link href="/ticket" className="my-3 w-fit"><Button type="button">Back to Tickets</Button></Link>

            <UpdateTicketForm ticket={JSON.parse(JSON.stringify(retrievedTicket))} 
                              projects={JSON.parse(JSON.stringify(projects))} 
                              resources={JSON.parse(JSON.stringify(retrievedUsers))}/>
        </main>
    )
}