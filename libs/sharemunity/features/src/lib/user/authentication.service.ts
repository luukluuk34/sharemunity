import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUser, IUserCredentials, IUserIdentity } from "@sharemunity-workspace/shared/api";
import { User } from "@sharemunity-workspace/user";
import { environment } from "@sharemunity/shared/util-env";
import { map, Observable } from "rxjs";

export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

@Injectable()
export class AuthenticationService {
    private readonly CURRENT_USER = 'currentuser';
    private readonly CURRENT_TOKEN = 'currenttoken';
    private user:IUser | null = null;

    endpoint = 'http://' + environment.dataApiUrl + '/auth';
   
    
    constructor(private readonly http: HttpClient) { 
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
                    this.saveUserToLocalStorage(val.results);
                    this.saveTokenToLocalStorage(val.results.token);
                    return val.results;
                })
            )
    }

    public register(name:string,email:string,password:string,address:string){
        const registerEndpoint = this.endpoint + '/register';
        return this.http
            .post<any>(registerEndpoint,{
                name,
                email,
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

    getUser(){
        return this.user;
    }
    logout(){
        localStorage.removeItem('currentuser');
        localStorage.removeItem('token')
        this.user = null;
    }

    private saveTokenToLocalStorage(token: string): void {
        localStorage.setItem(this.CURRENT_TOKEN, token);
      }
    private saveUserToLocalStorage(user: User): void {
        localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
      }

    private loadUser(){
        console.log("User already authenticated")
        const user = localStorage.getItem("currentuser");
        this.user = user ? JSON.parse(user) : null;
    }
}