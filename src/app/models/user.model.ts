import {Booking} from './booking.model'

export class User {
    constructor(public id: number,
                public username: string,
                public userType: UserType,
                public bookings: Booking[]) {
    }
}

export enum UserType {
    USER,
    ADMIN
}
