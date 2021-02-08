import {Component, OnInit} from '@angular/core'
import {TicketService} from '../../services/ticket/ticket.service'
import {Ticket} from '../../models/ticket.model'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Airline} from '../../models/airline.model'
import {Flight} from '../../models/flight.model'
import {BookingService} from '../../services/booking/booking.service'
import {AirlineService} from '../../services/airline/airline.service'
import {DataSharingService} from '../../services/datasharing/data-sharing.service'

@Component({
    selector: 'app-ticket-table',
    templateUrl: './ticket-table.component.html',
    styleUrls: ['./ticket-table.component.css'],
})
export class TicketTableComponent implements OnInit {

    public tickets: Ticket[]
    public userType: string
    public addTicketForm: FormGroup
    public searchTicketForm: FormGroup
    public currentUserType: string
    public airlines: Airline[] = []
    public flights: Flight[] = []
    public checked: boolean


    constructor(private ticketService: TicketService, private formBuilder: FormBuilder, private bookingService: BookingService, private airlineService: AirlineService, private dataSharingService: DataSharingService) {
        this.addTicketForm = this.formBuilder.group({
            oneWay: [''],
            flight: ['', Validators.required],
            departDate: ['', Validators.required],
            returnDate: [''],
            airline: ['', Validators.required],
            numberOfAvailableTickets: ['', Validators.required],
        })
        this.searchTicketForm = this.formBuilder.group({
            originSearch: [''],
            destinationSearch: [''],
            departDateSearch: [''],
            returnDateSearch: [''],
        })
        this.userType = localStorage.getItem('userType')
    }

    ngOnInit(): void {
        this.ticketService.fetchTickets().subscribe(tickets => {
            console.log(tickets)
            this.tickets = tickets
            for (let i = 0; i < this.tickets.length; i++) {
                this.flights[i] = this.tickets[i].flight
            }
            this.flights = this.flights.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
            this.airlines = this.airlines.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
            console.log(this.flights)
        })
        this.airlineService.fetchAirlines().subscribe(als => {
            this.airlines = als
            console.log(this.airlines)
        })
        this.checked = false
    }

    public get oneWay() {
        return this.addTicketForm.get('oneWay')
    }

    public get flight() {
        return this.addTicketForm.get('flight')
    }

    public get departDate() {
        return this.addTicketForm.get('departDate')
    }

    public get returnDate() {
        return this.addTicketForm.get('returnDate')
    }

    public get airline() {
        return this.addTicketForm.get('airline')
    }

    public get numberOfAvailableTickets() {
        return this.addTicketForm.get('numberOfAvailableTickets')
    }

    public selected() {
        this.checked = !this.checked
        if (this.checked) {
            this.addTicketForm.controls['returnDate'].disable()
            this.addTicketForm.controls['returnDate'].setValue('')
        } else {
            this.addTicketForm.controls['returnDate'].enable()
        }
    }

    public deleteTicket(id: number) {
        this.ticketService.deleteTicket(id.toString()).subscribe(ticket => {
            console.log(ticket)
            this.tickets = this.tickets.filter(obj => obj.id !== id)
        })
    }

    public submitAddTicketForm(credentials) {
        if (credentials.departDate > credentials.returnDate && !credentials.oneWay) {
            alert('Depart date can\'t be after return date.')
        } else if (credentials.numberOfAvailableTickets <= 0) {
            alert('Number of available tickets has to be more than 0.')
        } else if (credentials.oneWay) {
            this.ticketService.addTicket(this.findAirline(credentials.airline), credentials.oneWay, credentials.departDate, null, this.findFlight(credentials.flight), credentials.numberOfAvailableTickets).subscribe(ticket => {
                console.log(ticket)
                this.tickets.push(ticket)
            })
        } else if (!credentials.oneWay && credentials.returnDate !== undefined) {
            this.ticketService.addTicket(this.findAirline(credentials.airline), false, credentials.departDate, credentials.returnDate, this.findFlight(credentials.flight), credentials.numberOfAvailableTickets).subscribe(ticket => {
                console.log(ticket)
                this.tickets.push(ticket)
            })
        }
    }

    private findFlight(id: number): Flight {
        return this.flights.find(x => x.id == id)
    }

    private findAirline(id: number): Airline {
        return this.airlines.find(x => x.id == id)
    }

    public filterTicketByWay(event: any) {
        let selectedFilter = event.target.value
        console.log(selectedFilter)
        this.ticketService.getTickets().subscribe((tickets: Ticket[]) => {
            console.log(tickets)
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
        })
    }

    public submitSearchTicket(credentials) {
        console.log(credentials.departDateSearch.toString())
        this.ticketService.searchTicket(credentials.originSearch, credentials.destinationSearch, credentials.departDateSearch, credentials.returnDateSearch).subscribe(tickets => {
            console.log(tickets)
            this.tickets = tickets
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
}
