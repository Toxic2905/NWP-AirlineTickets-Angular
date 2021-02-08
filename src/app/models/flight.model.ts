import {City} from './city.model'

export class Flight {
    constructor(public id: number, name: string, public origin: City,public destination: City) {
    }
}
