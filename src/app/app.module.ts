import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http'

import {AppRoutingModule} from './app-routing.module'
import {AppComponent} from './app.component'
import {LoginComponent} from './components/login/login.component'
import {HeaderComponent} from './components/header/header.component'
import {MainPageComponent} from './components/main-page/main-page.component'
import {TicketTableComponent} from './components/ticket-table/ticket-table.component'
import {BookingTableComponent} from './components/booking-table/booking-table.component'
import {TicketEditComponent} from './components/ticket-edit/ticket-edit.component'
import {AirlinePageComponent} from './components/airline-page/airline-page.component'
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt'

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HeaderComponent,
        MainPageComponent,
        TicketTableComponent,
        BookingTableComponent,
        TicketEditComponent,
        AirlinePageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
    ],
    providers: [{provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
        JwtHelperService],
    bootstrap: [AppComponent],
})
export class AppModule {
}
