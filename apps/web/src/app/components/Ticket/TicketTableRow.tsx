"use client";

import { TableCell, TableRow } from "../ui/table";
import User from "../Global/User";
import { User as UserModel } from "@/app/models/userModel";
import { Ticket } from "@/app/models/ticketModel";
import { Project } from "@/app/models/projectModel";

export default function TicketTableRow({ ticket }: { ticket: Ticket }) {
  return (
    <TableRow
      key={ticket._id!.toString()}
      onClick={() =>
        (window.location.href = `${
          window.location.origin
        }/ticket/${ticket._id!.toString()}`)
      }
      className="cursor-pointer"
    >
      <TableCell>{ticket.number}</TableCell>
      <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
      <TableCell className="w-fit">{ticket.shortDescription}</TableCell>
      <TableCell>
        {ticket.caller ? (
          <User user={ticket.caller as UserModel} />
        ) : (
          <User
            user={{
              firstName: "Unassigned",
              lastName: "",
              email: "",
              title: "",
            }}
          />
        )}
      </TableCell>
      <TableCell className="w-fit">{ticket.priority}</TableCell>
      <TableCell className="w-fit">{ticket.state}</TableCell>
      <TableCell className="w-fit">
        {(ticket.project as Project).name}
      </TableCell>
      <TableCell className="w-fit">{ticket.category}</TableCell>
      <TableCell>
        {ticket.assignedTo ? (
          <User user={ticket.assignedTo as UserModel} />
        ) : (
          <User
            user={{
              firstName: "Unassigned",
              lastName: "",
              email: "",
              title: "",
            }}
          />
        )}
      </TableCell>
      <TableCell className="w-fit">
        {ticket.updatedAt
          ? new Date(ticket.updatedAt).toLocaleDateString()
          : "No Updates"}
      </TableCell>
    </TableRow>
  );
}
