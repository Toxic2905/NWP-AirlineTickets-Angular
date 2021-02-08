import {Component, OnInit} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {UserService} from '../../services/user/user.service'
import {User, UserType} from '../../models/user.model'
import {TicketService} from '../../services/ticket/ticket.service'
import {Ticket} from '../../models/ticket.model'
import {Airline} from '../../models/airline.model'
import {City} from '../../models/city.model'

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {

    public addUserForm: FormGroup
    public currentUserType: string

    constructor(private userService: UserService, private ticketService: TicketService, private formBuilder: FormBuilder) {
        this.addUserForm = this.formBuilder.group({
            username: ['', Validators.required],
            userType: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')]],
        })
        this.currentUserType = localStorage.getItem('userType')
    }

    ngOnInit(): void {
    }


    public get username() {
        return this.addUserForm.get('username')
    }

    public get password() {
        return this.addUserForm.get('password')
    }

    public get userType() {
        return this.addUserForm.get('userType')
    }

    public submitAddUserForm(credentials) {
        let postUserType
        if (credentials.userType == 'ADMIN') {
            postUserType = UserType.ADMIN
        } else if (credentials.userType == 'USER') {
            postUserType = UserType.USER
        } else {
            alert('What did you do with the user')
            return
        }
        this.userService.addUser(credentials.username, postUserType, credentials.password).subscribe(user => {
            console.log(user)
        })
    }

}
