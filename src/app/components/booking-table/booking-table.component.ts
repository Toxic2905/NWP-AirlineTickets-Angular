import {Component, OnInit} from '@angular/core'
import {BookingService} from '../../services/booking/booking.service'
import {Booking} from '../../models/booking.model'
import {DataSharingService} from '../../services/datasharing/data-sharing.service'

@Component({
    selector: 'app-booking-table',
    templateUrl: './booking-table.component.html',
    styleUrls: ['./booking-table.component.css'],
})
export class BookingTableComponent implements OnInit {

    public bookings: Booking[]
    public userType: string

    constructor(private bookingService: BookingService, private dataSharingService: DataSharingService) {
    }

    ngOnInit(): void {
        this.userType = localStorage.getItem('userType')
        this.bookingService.fetchBookings().subscribe(bookings => {
            console.log(bookings)
            this.bookings = bookings
        })
    }

    public deleteBooking(booking: Booking) {
        let now = new Date(new Date().getTime())
        let dateB = Date.parse(booking.ticket.departDate.toString()) - (24 * 60 * 60 * 1000)
        let dateAf = Date.parse(booking.ticket.departDate.toString())
        if (now.getTime() > dateB && now.getTime() < dateAf) {
            alert('Can\'t delete less than 24h before departure.')
        } else {
            this.bookingService.deleteBooking(booking.id).subscribe(bg => {
                console.log(bg)
                this.bookings = this.bookings.filter(obj => obj.id !== booking.id)
                this.dataSharingService.numberOfReservations.next(this.dataSharingService.numberOfReservations.getValue() - 1)
            })
        }
    }


    public buyBooking(id: number) {
        this.bookingService.buyBooking(id.toString()).subscribe(booking => {
            console.log(booking)
            this.bookings = this.bookings.filter(obj => obj.id !== id)
            this.dataSharingService.numberOfReservations.next(this.dataSharingService.numberOfReservations.getValue() - 1)
        })
    }

}
