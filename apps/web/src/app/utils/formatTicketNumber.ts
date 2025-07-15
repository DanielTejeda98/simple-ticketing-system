import { TicketType } from "../models/ticketTypeModel";

const TICKET_NAME_LENGTH = 8;

export default function formatTicketNumber(ticketNumber: number, ticketType?: TicketType) {
    if (ticketType) {
        return `${ticketType.identifier}${ticketNumber.toString().padStart(TICKET_NAME_LENGTH, '0')}`;
    }
    return ticketNumber?.toString().padStart(TICKET_NAME_LENGTH, '0');
}