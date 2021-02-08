import {Flight} from './flight.model'
import {Airline} from './airline.model'

export class Ticket {
    constructor(public id: number,
                public airline: Airline,
                public oneWay: boolean,
                public departDate: Date,
                public returnDate: Date,
                public flight: Flight,
                public numberOfAvailableTickets: number) {
    }
}
