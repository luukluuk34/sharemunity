import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IProduct } from '@sharemunity-workspace/shared/api';
import { Injectable } from '@angular/core';
import {environment} from '@sharemunity/shared/util-env';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

/**
 *
 *
 */
@Injectable()
export class ProductService {
    private readonly CURRENT_TOKEN = 'currenttoken';
    endpoint = 'http://' + environment.dataApiUrl + '/product';

    constructor(private readonly http: HttpClient) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<IProduct[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IProduct[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IProduct[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<IProduct> {
        console.log(`read ${this.endpoint}`);
        return this.http
            .get<ApiResponse<IProduct>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IProduct),
                catchError(this.handleError)
            );
    }

    public create(formData:FormData):Observable<IProduct>{
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
            .post<IProduct>(this.endpoint,formData,httpOptions)
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

    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in ProductService', error);
        return throwError(() => new Error(error.message));
    }
}
