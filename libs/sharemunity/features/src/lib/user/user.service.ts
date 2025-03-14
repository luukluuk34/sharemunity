import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ApiResponse, IUser, IUserCredentials, IUserIdentity } from '@sharemunity-workspace/shared/api';
import { environment } from '@sharemunity/shared/util-env';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

@Injectable()
export class UserService {
    endpoint = 'http://' + environment.dataApiUrl + '/user';
    constructor(private readonly http: HttpClient) { }


    public list(options?: any): Observable<IUser[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IUser[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IUser[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<IUser> {
        console.log(`read ${this.endpoint}`);
        let url = this.endpoint;
        if(id != null){
            url = url + "/" + id;
        }
        console.log(url);
        return this.http
            .get<ApiResponse<IUserIdentity>>(url, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError(this.handleError)
            );
    }

    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in ProductService', error);
        return throwError(() => new Error(error.message));
    }
}
