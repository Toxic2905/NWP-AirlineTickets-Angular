import {throwError} from 'rxjs'

export function handleError(error) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.error}`
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    alert(error.status+"\n"+error.error)
    console.log(error)
    console.log(errorMessage)
    return throwError(errorMessage)
}
