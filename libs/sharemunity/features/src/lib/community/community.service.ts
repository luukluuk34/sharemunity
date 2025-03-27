import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ICommunity, ICreateCommunity, IImage, IProduct } from '@sharemunity-workspace/shared/api';
import { Injectable } from '@angular/core';
import {environment} from '@sharemunity/shared/util-env';
import { AuthenticationService } from '../user/authentication.service';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

@Injectable({
    providedIn: 'root'
})
export class CommunityService {
    private readonly CURRENT_TOKEN = 'currenttoken';

    //TODO Delete in prod
    endpoint = 'http://' + environment.dataApiUrl + '/community';
   

    constructor(private readonly http: HttpClient) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<ICommunity[] | null> {
        console.log(`list ${this.endpoint}`);
        return this.http
            .get<ApiResponse<ICommunity[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as ICommunity[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<ICommunity> {
        console.log(`read ${this.endpoint}`);
        return this.http
            .get<ApiResponse<ICommunity>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as ICommunity),
                catchError(this.handleError)
            );
    }

    public create(formData:FormData): Observable<ICommunity>{
        console.log(`Creating community ${formData.get('name')} at ${this.endpoint}`);

        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };
        return this.http
            .post<ICommunity>(this.endpoint,formData,httpOptions)
            .pipe(
                map((val) =>{
                    console.log("Results: ",val)
                    return val;
                }),
                catchError((error) =>{
                    console.error("Error: ", error)
                    throw error;
                })
            )
    }

    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in ProductService', error);
        return throwError(() => new Error(error.message));
    }
}
