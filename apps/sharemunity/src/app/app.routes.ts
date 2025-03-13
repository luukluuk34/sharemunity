import { Route } from '@angular/router';
import { LoginComponent } from '../lib/authentication/login/login.component';
import { RegisterComponent } from '../lib/authentication/register/register.component';

export const appRoutes: Route[] = [
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent}
];
