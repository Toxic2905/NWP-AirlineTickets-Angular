import {Component, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {TicketService} from '../../services/ticket/ticket.service'
import {ActivatedRoute, Router} from '@angular/router'
import {Ticket} from '../../models/ticket.model'
import {Airline} from '../../models/airline.model'
import {Flight} from '../../models/flight.model'
import {AirlineService} from '../../services/airline/airline.service'

@Component({
    selector: 'app-ticket-edit',
    templateUrl: './ticket-edit.component.html',
    styleUrls: ['./ticket-edit.component.css'],
})
export class TicketEditComponent implements OnInit {

    public editTicketForm: FormGroup
    public ticket: Ticket
    public checked: boolean
    public airlines: Airline[] = []
    public flights: Flight[] = []
    public userType: string


    constructor(private ticketService: TicketService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private airlineService: AirlineService, private router: Router) {
        this.editTicketForm = this.formBuilder.group({
            oneWay: [''],
            flight: ['', Validators.required],
            departDate: ['', Validators.required],
            returnDate: [''],
            airline: ['', Validators.required],
            numberOfAvailableTickets: ['', Validators.required],
        })
    }

    ngOnInit(): void {
        this.userType = localStorage.getItem('userType')
        this.activatedRoute.paramMap.subscribe(params => {
            const id: number = Number(params.get('id'))
            console.log(id)
            this.airlineService.fetchAirlines().subscribe(als => {
                this.airlines = als
                console.log(this.airlines)
            })
            this.ticketService.getTickets().subscribe(tickets => {
                console.log(tickets)
                this.ticket = tickets.filter(user => user.id === id)[0]
                for (let i = 0; i < tickets.length; i++) {
                    this.flights[i] = tickets[i].flight
                }
                this.flights = this.flights.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i)
                this.editTicketForm.setValue({
                    oneWay: this.ticket.oneWay, flight: this.ticket.flight.id,
                    departDate: this.ticket.departDate, returnDate: this.ticket.returnDate, airline: this.ticket.airline.id,
                    numberOfAvailableTickets: this.ticket.numberOfAvailableTickets,
                })
                if (this.ticket.oneWay) {
                    this.selected()
                }
            })
        })
    }

    public submitEditTicketForm(credentials) {
        console.log(credentials.returnDate)
        if (credentials.departDate > credentials.returnDate && !credentials.oneWay) {
            if (credentials.returnDate === undefined || credentials.returnDate === null || credentials.returnDate === '') {
                alert('Chose one way or return date.')
                return
            }
            alert('Depart date can\'t be after return date.')
        } else if (credentials.numberOfAvailableTickets <= 0) {
            alert('Number of available tickets has to be more than 0.')
        } else if (credentials.oneWay) {
            this.ticketService.editTicket(this.ticket.id, this.findAirline(credentials.airline), credentials.oneWay, credentials.departDate, null, this.findFlight(credentials.flight), credentials.numberOfAvailableTickets).subscribe(ticket => {
                console.log(ticket)
                this.router.navigate(['/home'])
            })
        } else if (!credentials.oneWay && credentials.returnDate !== undefined) {
            this.ticketService.editTicket(this.ticket.id, this.findAirline(credentials.airline), false, credentials.departDate, credentials.returnDate, this.findFlight(credentials.flight), credentials.numberOfAvailableTickets).subscribe(ticket => {
                console.log(ticket)
                this.router.navigate(['/home'])
            })
        }
    }

    public selected() {
        this.checked = !this.checked
        if (this.checked) {
            this.editTicketForm.controls['returnDate'].disable()
            this.editTicketForm.controls['returnDate'].setValue('')
        } else {
            this.editTicketForm.controls['returnDate'].enable()
        }
    }

    public get oneWay() {
        return this.editTicketForm.get('oneWay')
    }

    public get flight() {
        return this.editTicketForm.get('flight')
    }

    public get departDate() {
        return this.editTicketForm.get('departDate')
    }

    public get returnDate() {
        return this.editTicketForm.get('returnDate')
    }

    public get airline() {
        return this.editTicketForm.get('airline')
    }

    public get numberOfAvailableTickets() {
        return this.editTicketForm.get('numberOfAvailableTickets')
    }

    private findFlight(id: number): Flight {
        return this.flights.find(x => x.id == id)
    }

    private findAirline(id: number): Airline {
        return this.airlines.find(x => x.id == id)
    }
}
