import {Component, OnInit} from '@angular/core'
import {TicketService} from '../../services/ticket/ticket.service'
import {AirlineService} from '../../services/airline/airline.service'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {Airline} from '../../models/airline.model'
import {Ticket} from '../../models/ticket.model'
import {BookingService} from '../../services/booking/booking.service'
import {DataSharingService} from '../../services/datasharing/data-sharing.service'

@Component({
    selector: 'app-airline-page',
    templateUrl: './airline-page.component.html',
    styleUrls: ['./airline-page.component.css'],
})
export class AirlinePageComponent implements OnInit {

    public airline: Airline
    public tickets: Ticket[]
    public addAirlineForm: FormGroup
    public editAirlineForm: FormGroup
    public userType: string
    public searchTicketForm: FormGroup

    constructor(private ticketService: TicketService, private airlineService: AirlineService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private bookingService: BookingService, private router: Router, private dataSharingService: DataSharingService) {
        this.editAirlineForm = this.formBuilder.group({
            nameEdit: ['', Validators.required],
        })
        this.addAirlineForm = this.formBuilder.group({
            nameAdd: ['', Validators.required],
        })
        this.searchTicketForm = this.formBuilder.group({
            originSearch: [''],
            destinationSearch: [''],
            departDateSearch: [''],
            returnDateSearch: [''],
        })
        this.airline = new Airline(null, '')
    }

    ngOnInit(): void {
        this.userType = localStorage.getItem('userType')
        this.activatedRoute.paramMap.subscribe(params => {
            const id: number = Number(params.get('id'))
            console.log(id)
            this.ticketService.getTickets().subscribe((tickets: Ticket[]) => {
                this.tickets = tickets.filter(ticket => ticket.airline.id === id)
                console.log(this.tickets)
                this.airline = this.tickets[0].airline
                this.editAirlineForm.setValue({nameEdit: this.airline.name})
            })
        })
    }

    public submitEditAirline(credentials) {
        this.airlineService.editAirline(this.airline.id.toString(), credentials.nameEdit).subscribe(al => {
            console.log(al)
            this.airline = al
            this.filterTicketByWay(event)
        })
    }

    public submitAddAirline(credentials) {
        this.airlineService.addAirline(credentials.nameAdd).subscribe(al => {
            console.log(al)
        })
    }

    public get nameEdit() {
        return this.editAirlineForm.get('nameEdit')
    }

    public get nameAdd() {
        return this.addAirlineForm.get('nameAdd')
    }

    public deleteTicket(id: number) {
        this.ticketService.deleteTicket(id.toString()).subscribe(ticket => {
            console.log(ticket)
            this.tickets = this.tickets.filter(obj => obj.id !== id)
        })
    }

    public reserve(ticket: Ticket) {
        let numberOfTickets = (<HTMLInputElement> document.getElementById('input-reserve-number' + ticket.id)).value
        if (parseInt(numberOfTickets) === null || parseInt(numberOfTickets) === undefined || isNaN(parseInt(numberOfTickets))) {
            alert('Needs number of tickets!')
        } else if (new Date() > new Date(ticket.departDate)) {
            alert('Can\'t book unavailable flight!')
        } else if (parseInt(numberOfTickets) > ticket.numberOfAvailableTickets) {
            alert('Can\'t reserve more tickets than available.')
        } else {
            this.bookingService.addBooking(ticket, parseInt(numberOfTickets)).subscribe(booking => {
                console.log(booking)
                let t = this.tickets.find(x => x.id == ticket.id)
                t.numberOfAvailableTickets = t.numberOfAvailableTickets - parseInt(numberOfTickets)
                this.dataSharingService.numberOfReservations.next(this.dataSharingService.numberOfReservations.getValue() + 1)
            })
        }
    }

    public filterTicketByWay(event: any) {
        let selectedFilter = event.target.value
        console.log(selectedFilter)
        if (selectedFilter === undefined) {
            selectedFilter = 0
        }
        this.ticketService.getTickets().subscribe((tickets: Ticket[]) => {
            if (selectedFilter == 0) { // all
                this.tickets = tickets
            } else if (selectedFilter == 1) { // return
                this.tickets = tickets.filter(function(tic) {
                    return tic.oneWay === false
                })
            } else { // one way
                this.tickets = tickets.filter(function(tic) {
                    return tic.oneWay === true
                })
            }
            this.tickets = this.tickets.filter(ticket => ticket.airline.id === this.airline.id)
        })
    }

    public deleteAirline(id: string) {
        this.airlineService.deleteAirline(id).subscribe(al => {
            console.log(al)
            this.router.navigate(['/home'])
        })
    }

    public submitSearchTicket(credentials) {
        console.log(credentials.departDateSearch.toString())
        this.ticketService.searchTicket(credentials.originSearch, credentials.destinationSearch, credentials.departDateSearch, credentials.returnDateSearch).subscribe(tickets => {
            console.log(tickets)
            this.tickets = tickets.filter(ticket => ticket.airline.id === this.airline.id)
        })
    }
}
