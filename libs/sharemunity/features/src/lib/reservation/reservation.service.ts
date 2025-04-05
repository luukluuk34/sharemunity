import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ICommunity, ICreateCommunity, IImage, IProduct, IReservaton } from '@sharemunity-workspace/shared/api';
import { Injectable } from '@angular/core';
import {environment} from '@sharemunity/shared/util-env';
import { AuthenticationService } from '../user/authentication.service';
import { response } from 'express';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

@Injectable()
export class ReservationService {
    private readonly CURRENT_TOKEN = 'currenttoken';

    endpoint = 'http://' + environment.dataApiUrl + '/reservation';

    constructor(private readonly http: HttpClient) {}


    public list(options?: any): Observable<IReservaton[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IReservaton[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IReservaton[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public listPending(options?:any): Observable<IReservaton[] | null>{
        const backend = this.endpoint + "/" + "pending";
        console.log(`List ${backend}`);
        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };
        return this.http
            .get<ApiResponse<IReservaton[]>>(backend,httpOptions)
            .pipe(
                map((response:any) => 
                    response.results.map((item:any) => ({
                        ...item,
                        id:item._id,
                        pickup_date: new Date(item.pickup_date),
                        end_date: item.end_date ? new Date(item.end_date) : null
                    }
                ))),
                tap(console.log),
                catchError(this.handleError)
            )
    }

    public myReservations(options?:any): Observable<IReservaton[] | null>{
        const backend = this.endpoint + "/" + "my";
        console.log(`List ${backend}`);
        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };
        return this.http
            .get<ApiResponse<IReservaton[]>>(backend,httpOptions)
            .pipe(
                map((response:any) => 
                    response.results.map((item:any) => ({
                        ...item,
                        id:item._id,
                        pickup_date: new Date(item.pickup_date),
                        end_date: item.end_date ? new Date(item.end_date) : null
                    }
                ))),
                tap(console.log),
                catchError(this.handleError)
            )
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id:string,options?: any): Observable<IReservaton[] | null> {
        console.log(`list ${this.endpoint}`);
        const backend = this.endpoint + "/" + id;
        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };
        return this.http
            .get<ApiResponse<IReservaton[]>>(backend, {
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IReservaton[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }


    public create(formData:FormData):Observable<IReservaton>{
        console.log(`Creating product at ${this.endpoint}`);
        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };
        
        return this.http
            .post<IReservaton>(this.endpoint,formData,httpOptions)
            .pipe(
                map((val) => {
                    console.log("Results: ", val);
                    return val;
                }),
                catchError((error)=> {
                    console.log("Error ", error)
                    throw error;
                })
            )
    }

    public update(reservation:IReservaton):Observable<IReservaton>{
        console.log(`Updating reservation at: ${reservation.id}`);
        const backend = this.endpoint + "/" + reservation.id;
        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };
        
        return this.http
            .put<IReservaton>(backend,reservation,httpOptions)
            .pipe(
                map((val)=>{
                    console.log("Results: ",val)
                    return val;
                }),
                catchError((error)=> {
                    console.log("Error: ", error)
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
