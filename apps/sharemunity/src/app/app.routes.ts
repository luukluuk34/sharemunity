import { Route } from '@angular/router';
import { LoginComponent } from '../lib/authentication/login/login.component';
import { RegisterComponent } from '../lib/authentication/register/register.component';
import { DashboardComponent } from '../lib/pages/dashboard/dashboard.component';
import { UserDetailComponent } from 'libs/sharemunity/features/src/lib/user/user-detail/user-detail.component';
import { CommunityMainComponent } from 'libs/sharemunity/features/src/lib/community/community-main/community-main.component';
import { CommunityFormComponent } from 'libs/sharemunity/features/src/lib/community/community-form/community-form.component';

export const appRoutes: Route[] = [
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'dashboard',component:DashboardComponent},
    {path:'user-detail/:id',component:UserDetailComponent},
    {path:'communities',component:CommunityMainComponent},
    {path:'communities/form',component:CommunityFormComponent},
    {path:'', redirectTo:'/dashboard',pathMatch:'full'}
];
