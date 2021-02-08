import {Flight} from './flight.model'
import {Ticket} from './ticket.model'

export class Booking {
    constructor(public id: number,
                public available: boolean,
                public flight: Flight,
                public ticket: Ticket,
                public numberOfTickets: number) {
    }
}
