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
    endpoint = environment.dataApiUrl + '/product';

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
                map((response: any) => 
                    response.results.map((item:any) => ({
                        ...item,
                        id: item._id,
                    })) 
            ),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public listByCommunity(id:string,options?: any){
        console.log(`list ${this.endpoint}`);
        const backend = this.endpoint + "/" +id + "/products";
        return this.http
            .get<ApiResponse<IProduct[]>>(backend, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => 
                    response.results.map((item:any) => ({
                        ...item,
                        id: item._id,
                    })) 
            ),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public listByUser(id:string,options?: any): Observable<IProduct[] | null> {
        console.log(`list ${this.endpoint}`);
        const backend = this.endpoint + "/user/" + id;
        return this.http
            .get<ApiResponse<IProduct[]>>(backend, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => 
                    response.results.map((item:any) => ({
                        ...item,
                        id: item._id,
                    })) 
            ),
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
        const backend = this.endpoint + "/" + id
        return this.http
            .get<ApiResponse<IProduct>>(backend, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) =>{
                    const product = response.results;
                    if(product){
                        product.id = product._id;
                        delete product._id;
                    }
                    return product;
                }),
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
        console.log(formData.getAll("images"));
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

    public delete(id: string | null, options?: any): Observable<IProduct> {
        const backend = this.endpoint + "/" + id
        console.log(`Deleting product at ${backend}`);
        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };
        return this.http
            .delete<IProduct>(backend,httpOptions)
            .pipe(
                map((val)=>{
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
