import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {Booking} from '../../models/booking.model'
import {HttpClient} from '@angular/common/http'
import {Ticket} from '../../models/ticket.model'
import {catchError} from 'rxjs/operators'
import {handleError} from '../handleError'

@Injectable({
    providedIn: 'root',
})
export class BookingService {

    private readonly bookingUrl = 'http://localhost:8080/api/booking'
    private bookings: Observable<Booking[]>

    constructor(private http: HttpClient) {
    }

    public getBookings(): Observable<Booking[]> {
        return this.bookings
    }

    public fetchBookings(): Observable<Booking[]> {
        this.bookings = this.http.get<Booking[]>(this.bookingUrl+'/all', {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        })
        return this.bookings
    }

    public addBooking(ticket: Ticket, numberOfTickets: number): Observable<Booking> {
        return this.http.post<Booking>(this.bookingUrl, {
            'isAvailable': true,
            'flight': ticket.flight,
            'ticket': ticket,
            'numberOfTickets': numberOfTickets,
        }, {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }

    public deleteBooking(id: number): Observable<Booking> {
        return this.http.delete<Booking>(this.bookingUrl + '/' + id, {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }

    public getNumberOfBookings(): Observable<number> {
        return this.http.get<number>(this.bookingUrl + '/getNumber', {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }

    public buyBooking(id: string): Observable<Booking> {
        return this.http.get<Booking>(this.bookingUrl + '/buy', {
            params: {
                'bookingId': id,
            },
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }
}
