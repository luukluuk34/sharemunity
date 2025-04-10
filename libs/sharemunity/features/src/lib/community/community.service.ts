import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ICommunity, ICreateCommunity, IImage, IProduct } from '@sharemunity-workspace/shared/api';
import { Injectable } from '@angular/core';
import {environment} from '@sharemunity/shared/util-env';
import { response } from 'express';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

@Injectable()
export class CommunityService {
    private readonly CURRENT_TOKEN = 'currenttoken';

    //TODO Delete in prod
    endpoint = environment.dataApiUrl + '/community';

    constructor(private readonly http: HttpClient) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(listString?:string,options?: any): Observable<ICommunity[] | null> {
        console.log(`list ${this.endpoint}`);
        let backend = this.endpoint;
        if(listString){
            backend = backend + "/" + listString
        }
        console.log(`list ${backend}`);
        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };
        return this.http
            .get<ApiResponse<ICommunity[]>>(backend, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) =>
                    response.results.map((item: any) => {
                        // Map _id to id for each community
                        if (item.products && Array.isArray(item.products)) {
                            item.products = item.products.map((product: any) => {
                                // Map _id to id for each product in the community
                                if (product._id) {
                                    product.id = product._id;
                                    delete product._id;  // Optionally remove _id if no longer needed
                                }
                                return product;
                            });
                        }
                        // Return the modified community
                        item.id = item._id; // Also map _id to id for the community itself
                        delete item._id;  // Optionally remove _id if no longer needed
                        return item;
                    })
                ),
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
    const backend = this.endpoint + "/" + id;
    return this.http
        .get<ApiResponse<ICommunity>>(backend, {
            ...options,
            ...httpOptions,
        })
        .pipe(
            tap(console.log),
            map((response: any) => {
                // Transform the response to ensure the `id` of each product is populated correctly
                if (response.results) {
                    response.results.id = response.results._id;
                    delete response.results._id;

                    response.results.products = response.results.products.map((product: any) => {
                        if (product._id) {
                            product.id = product._id;
                            delete product._id;
                        }
                        return product;
                    });
                }
                return response.results as ICommunity;
            }),
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
            .post<ApiResponse<ICommunity>>(this.endpoint,formData,httpOptions)
            .pipe(
                map((response:any) =>{
                    if (response.results) {
                        response.results.id = response.results._id;
                        delete response.results._id;
    
                        response.results.products = response.results.products.map((product: any) => {
                            if (product._id) {
                                product.id = product._id;
                                delete product._id;
                            }
                            return product;
                        });
                    }
                    return response.results as ICommunity;
                }),
                catchError((error) =>{
                    console.error("Error: ", error)
                    throw error;
                })
            )
    }

    public update(community:ICommunity){
        console.log(`Updating community ${community.name} at ${this.endpoint}`);
        console.log(community);
        const backend = this.endpoint + "/" + community.id;
        const token = localStorage.getItem(this.CURRENT_TOKEN);
        const httpOptions = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`
            }),
            observe: 'body' as const,
            responseType: 'json' as const
        };

        const updateCommunity = {
            owner:community.owner,
            name:community.name,
            description:community.description,
            communityImage:community.communityImage,
            creationDate:community.creationDate,
            members:community.members?.map(member => member._id) || [],
            products:community.products?.map(prod => prod.id) || [],
        };
        return this.http
            .put<ICommunity>(backend,updateCommunity,httpOptions)
            .pipe(
                map((value) => {
                    console.log("Results: ", value);
                    return value;
                }),
                catchError((error)=>{
                    console.log("Error: ",error);
                    throw error;
                })
            )
    }

    public delete(id: string | null, options?: any): Observable<ICommunity> {
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
            .delete<ICommunity>(backend,httpOptions)
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
        console.log('handleError in Community Service', error);
        return throwError(() => new Error(error.message));
    }
}
