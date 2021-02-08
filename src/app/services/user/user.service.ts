import {Injectable} from '@angular/core'
import {User, UserType} from '../../models/user.model'
import {HttpClient} from '@angular/common/http'
import {Observable, throwError} from 'rxjs'
import {catchError} from 'rxjs/operators'
import {handleError} from '../handleError'
import {printLine} from 'tslint/lib/verify/lines'

@Injectable({
    providedIn: 'root',
})
export class UserService {

    private readonly usersUrl = 'http://localhost:8080/api/user'

    constructor(private http: HttpClient) {
    }

    public addUser(username: string, userType: UserType, password: string): Observable<User> {
        return this.http.post<User>(this.usersUrl, {
            'username': username,
            'userType': userType,
            'password': password,
        }, {
            headers: {'Authorization': 'Bearer '.concat(localStorage.getItem('jwt'))},
        }).pipe(catchError(handleError))
    }
}
