import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {Airline} from '../../models/airline.model'
import {HttpClient} from '@angular/common/http'
import {catchError} from 'rxjs/operators'
import {handleError} from '../handleError'

@Injectable({
    providedIn: 'root',
})
export class AirlineService {

    public readonly airlineUrl = 'http://localhost:8080/api/airline'
    public airlines: Observable<Airline[]>

    constructor(private http: HttpClient) {
    }

    public getAirlines(): Observable<Airline[]> {
        return this.airlines
    }

    public fetchAirlines(): Observable<Airline[]> {
        this.airlines = this.http.get<Airline[]>(this.airlineUrl + '/all', {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        })
        return this.airlines
    }

    public addAirline(name: string): Observable<Airline> {
        return this.http.post<Airline>(this.airlineUrl, {
            'name': name,
        }, {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }

    public editAirline(id: string, name: string): Observable<Airline> {
        return this.http.put<Airline>(this.airlineUrl, {
            'id': id,
            'name': name,
        }, {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }

    public deleteAirline(id: string): Observable<Airline> {
        return this.http.delete<Airline>(this.airlineUrl + '/' + id, {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }
}
