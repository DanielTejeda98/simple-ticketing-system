import SystemsTicketTypeForm from "@/app/components/System/TicketType/TicketTypeForm";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function SystemsTicketTypeNewPage () {
    return (
        <main className="flex flex-col w-full px-4 md:px-8 mt-6 md:mt-[10vh]">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text max-h-fit">
                <h1 className="text-2xl md:text-4xl text-transparent">New Ticket Type</h1>
                <p className="text-lg md:text-xl text-transparent">Create a new ticket type</p>
            </div>
            <Link href="/system/ticket-types" className="my-3 w-fit"><Button type="button">Back to Ticket Types</Button></Link>

            <SystemsTicketTypeForm />
        </main>
    )
}