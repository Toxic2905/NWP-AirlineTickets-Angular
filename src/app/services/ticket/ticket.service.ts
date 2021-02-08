import {Injectable} from '@angular/core'
import {Ticket} from '../../models/ticket.model'
import {Observable} from 'rxjs'
import {HttpClient} from '@angular/common/http'
import {Airline} from '../../models/airline.model'
import {Flight} from '../../models/flight.model'
import {catchError} from 'rxjs/operators'
import {handleError} from '../handleError'

@Injectable({
    providedIn: 'root',
})
export class TicketService {

    private readonly ticketUrl = 'http://localhost:8080/api/ticket'
    private tickets: Observable<Ticket[]>

    constructor(private http: HttpClient) {
    }

    public getTickets(): Observable<Ticket[]> {
        return this.tickets
    }

    public fetchTickets(): Observable<Ticket[]> {
        this.tickets = this.http.get<Ticket[]>(this.ticketUrl + '/all', {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        })
        return this.tickets
    }

    public fetchTicketsById(id: string): Observable<Ticket> {
        return this.http.get<Ticket>(this.ticketUrl, {
            params: {
                ticketId: id,
            }, headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }

    public addTicket(airline: Airline, oneWay: boolean, departDate: Date, returnDate: Date, flight: Flight, numberOfAvailableTickets: number) {
        return this.http.post<Ticket>(this.ticketUrl, {
            'airline': airline,
            'oneWay': oneWay,
            'departDate': departDate,
            'returnDate': returnDate,
            'flight': flight,
            'numberOfAvailableTickets': numberOfAvailableTickets,
        }, {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }

    public deleteTicket(id: string): Observable<Ticket> {
        return this.http.delete<Ticket>(this.ticketUrl + '/' + id, {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }

    public editTicket(id: number, airline: Airline, oneWay: boolean, departDate: Date, returnDate: Date, flight: Flight, numberOfAvailableTickets: number) {
        return this.http.put<Ticket>(this.ticketUrl, {
            'id': id,
            'airline': airline,
            'oneWay': oneWay,
            'departDate': departDate,
            'returnDate': returnDate,
            'flight': flight,
            'numberOfAvailableTickets': numberOfAvailableTickets,
        }, {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }

    public searchTicket(origin: string, destination: string, departDate: Date, returnDate: Date) {
        return this.http.get<Ticket[]>(this.ticketUrl + '/search', {
            params: {
                origin: origin,
                destination: destination,
                departDate: departDate.toString(),
                returnDate: returnDate.toString(),
            }, headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }
}
