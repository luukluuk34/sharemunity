import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUserCredentials, IUserIdentity } from "@sharemunity-workspace/shared/api";
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
    
    endpoint = 'http://' + environment.dataApiUrl + '/auth';
    
    constructor(private readonly http: HttpClient) { }

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
                    this.saveTokenFromLocalStorage(val.results.token);
                    return val.results;
                })
            )
    }

    private saveTokenFromLocalStorage(token: string): void {
        localStorage.setItem(this.CURRENT_TOKEN, token);
      }
      private saveUserToLocalStorage(user: User): void {
        localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
      }
}