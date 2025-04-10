import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ICommunity, ICreateCommunity, IImage, IProduct, IReservation } from '@sharemunity-workspace/shared/api';
import { Injectable } from '@angular/core';
import {environment} from '@sharemunity/shared/util-env';

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

    endpoint = environment.dataApiUrl + '/reservation';

    constructor(private readonly http: HttpClient) {}


    public list(options?: any): Observable<IReservation[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IReservation[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IReservation[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public listPending(options?:any): Observable<IReservation[] | null>{
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
            .get<ApiResponse<IReservation[]>>(backend,httpOptions)
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

    public myReservations(options?:any): Observable<IReservation[] | null>{
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
            .get<ApiResponse<IReservation[]>>(backend,httpOptions)
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
    public read(id:string,options?: any): Observable<IReservation | null> {
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
            .get<ApiResponse<IReservation[]>>(backend, {
                ...httpOptions,
            })
            .pipe(
                map((response: any) => {
                    let reservation = response.results;
                    if(reservation){
                        reservation.id = reservation._id;
                        delete reservation._id;
                    }
                    return reservation;
                }),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public getProductReservation(prodId:string):Observable<IReservation>{
        console.log(`Get Reservation from product ID ${this.endpoint}`);
        const backend = this.endpoint + "/product/" + prodId;
        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };
        return this.http
            .get<ApiResponse<IReservation>>(backend, {
                ...httpOptions,
            })
            .pipe(
                map((response: any) => {
                    let reservation = response.results;
                    if(reservation){
                        reservation.id = reservation._id;
                        delete reservation._id;
                    }
                    return reservation;
                }),
                tap(console.log),
                catchError(this.handleError)
            );
    }


    public create(formData:FormData):Observable<IReservation>{
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
            .post<IReservation>(this.endpoint,formData,httpOptions)
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

    public update(reservation:IReservation):Observable<IReservation>{
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
            .put<IReservation>(backend,reservation,httpOptions)
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

    public delete(id:string):Observable<IReservation>{
        console.log(`Delete Reservation ${this.endpoint}`);
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
            .delete<ApiResponse<IReservation[]>>(backend, {
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IReservation[]),
                tap(console.log),
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
