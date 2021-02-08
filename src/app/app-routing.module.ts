import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'
import {LoginComponent} from './components/login/login.component'
import {MainPageComponent} from './components/main-page/main-page.component'
import {BookingTableComponent} from './components/booking-table/booking-table.component'
import {TicketEditComponent} from './components/ticket-edit/ticket-edit.component'
import {AirlinePageComponent} from './components/airline-page/airline-page.component'
import {AuthGuardService} from './services/auth/auth-guard.service'

const routes: Routes = [
    // http://localhost:4200/
    {path: '', component: LoginComponent},
    // http://localhost:4200/home
    {path: 'home', component: MainPageComponent, canActivate: [AuthGuardService]},
    // http://localhost:4200/home/booking
    {path: 'booking', component: BookingTableComponent, canActivate: [AuthGuardService]},
    // http://localhost:4200/ticket
    {path: 'ticket/:id', component: TicketEditComponent, canActivate: [AuthGuardService]},
    // http://localhost:4200/airline
    {path: 'airline/:id', component: AirlinePageComponent, canActivate: [AuthGuardService]},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
