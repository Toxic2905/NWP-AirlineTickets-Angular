import {Injectable, OnDestroy} from '@angular/core'
import {HttpClient, HttpParams} from '@angular/common/http'
import {Credentials} from '../models/credentials.model'
import {catchError, map} from 'rxjs/operators'
import {Router} from '@angular/router'
import {throwError} from 'rxjs'
import {handleError} from './handleError'

@Injectable({
    providedIn: 'root',
})
export class LoginService implements OnDestroy {

    private readonly loginUrl = 'http://localhost:8080/auth/login'

    constructor(private http: HttpClient, private router: Router) {
    }

    ngOnDestroy(): void {
        this.logout()
    }

    login(credentials) {
        let httpParams = new HttpParams()
        httpParams.append('username', credentials.username)
        return this.http.post<Credentials>(this.loginUrl, {
                username: credentials.username,
                password: credentials.password,
            },
        ).pipe(map((responseData: Credentials) => {
                console.log(responseData)
                localStorage.setItem('jwt', responseData.jwt)
                localStorage.setItem('userType', responseData.userType)
                localStorage.setItem('username', credentials.username)
            }),
            catchError(handleError))
    }

    logout() {
        localStorage.removeItem('jwt')
        localStorage.removeItem('username')
        localStorage.removeItem('userType')
        this.router.navigate(['/'])
    }
}

