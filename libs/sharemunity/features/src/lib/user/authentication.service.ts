import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUser, IUserCredentials, IUserIdentity } from "@sharemunity-workspace/shared/api";
import { User } from "@sharemunity-workspace/backend/user";
import { environment } from "@sharemunity/shared/util-env";
import { BehaviorSubject, catchError, map, Observable, of, Subject, throwError } from "rxjs";

export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

@Injectable()
export class AuthenticationService {
    private readonly CURRENT_USER = 'currentuser';
    private readonly CURRENT_TOKEN = 'currenttoken';
    private userSubject = new BehaviorSubject<IUser | null>(null);
    user$ = this.userSubject.asObservable();

    endpoint = 'http://' + environment.dataApiUrl + '/auth';
   
    
    constructor(private readonly http: HttpClient) { 
        console.log(`AuthService Constructed`, new Date(), this.constructor.name)
        this.loadUser();
    }

    public login(emailAddress:string, password:string, options?:any): Observable<IUserIdentity[] | null>{
        const loginEndpoint = this.endpoint + '/login';
        console.log(`Getting login user at ${loginEndpoint}`)
        return this.http
            .post<any>(loginEndpoint, {
                emailAddress, 
                password,
                ...httpOptions })
            .pipe(
                map((val) =>{
                    console.log("------------------")
                    console.log(val.results.token)
                    this.saveUserToLocalStorage(val.results);
                    this.saveTokenToLocalStorage(val.results.token);
                    return val.results;
                }),
                catchError((error)=>{
                    console.error(`Login failed`, error);
                    throw error;
                })
            )
    }

    public register(name:string,email:string,password:string,address:string){
        const registerEndpoint = this.endpoint + '/register';
        return this.http
            .post<any>(registerEndpoint,{
                name,
                emailAddress:email,
                password,
                address,
                ...httpOptions
            })
            .pipe(
                map((val) => {
                    this.saveUserToLocalStorage(val.results);
                    this.saveTokenToLocalStorage(val.results.token);
                    return val.results;
                })
            )
    }

    logout(){
        localStorage.removeItem(this.CURRENT_USER);
        localStorage.removeItem(this.CURRENT_TOKEN)
        this.userSubject.next(null);
    }

    private saveTokenToLocalStorage(token: string): void {
        localStorage.setItem(this.CURRENT_TOKEN, token);
      }
    private saveUserToLocalStorage(user: User): void {
        this.userSubject.next(user);
        localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
      }
      

    private loadUser(){
        console.log("User already authenticated")
        const user = localStorage.getItem("currentuser");
        if(user){
            this.userSubject.next(JSON.parse(user));
        }
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in ProductService', error);
        return throwError(() => new Error(error.message));
    } 

}