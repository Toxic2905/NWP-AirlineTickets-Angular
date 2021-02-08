import {Component, OnInit} from '@angular/core'
import {LoginService} from '../../services/login.service'
import {BookingService} from '../../services/booking/booking.service'
import {DataSharingService} from '../../services/datasharing/data-sharing.service'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

    public username: string
    public userType: string
    public numberOfReservations: number

    constructor(private loginService: LoginService, private bookingService: BookingService, private dataSharingService: DataSharingService) {
    }

    ngOnInit(): void {
        this.username = localStorage.getItem('username')
        this.userType = localStorage.getItem('userType')
        this.bookingService.getNumberOfBookings().subscribe(n => {
            this.dataSharingService.numberOfReservations.next(n)
            this.dataSharingService.numberOfReservations.subscribe(value => {
                this.numberOfReservations = value
            })
        })
    }

    logout() {
        this.loginService.logout()
    }

}
