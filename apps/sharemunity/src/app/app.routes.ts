import { Route } from '@angular/router';
import { LoginComponent } from '../lib/authentication/login/login.component';
import { RegisterComponent } from '../lib/authentication/register/register.component';
import { DashboardComponent } from '../lib/pages/dashboard/dashboard.component';
import { UserDetailComponent } from 'libs/sharemunity/features/src/lib/user/user-detail/user-detail.component';
import { CommunityMainComponent } from 'libs/sharemunity/features/src/lib/community/community-main/community-main.component';
import { CommunityFormComponent } from 'libs/sharemunity/features/src/lib/community/community-form/community-form.component';
import { ProductFormComponent } from 'libs/sharemunity/features/src/lib/product/product-form/product-form.component';
import { CommunityDetailComponent } from 'libs/sharemunity/features/src/lib/community/community-detail/community-detail.component';
import { ProductDetailComponent } from 'libs/sharemunity/features/src/lib/product/product-detail/product-detail.component';
import { DashboardWrapperComponent } from '../lib/pages/dashboard-wrapper/dashboard-wrapper.component';
import { DashboardGuestComponent } from '../lib/pages/dashboard-guest/dashboard-guest.component';
import { ReservationOverviewComponent } from 'libs/sharemunity/features/src/lib/reservation/reservation-overview/reservation-overview.component';
import { CommunityUpdateFormComponent } from 'libs/sharemunity/features/src/lib/community/community-update-form/community-update-form.component';
import { ProductUpdateFormComponent } from 'libs/sharemunity/features/src/lib/product/product-update-form/product-update-form.component';
import { AboutComponent } from '../lib/layout/about/about.component';

export const appRoutes: Route[] = [
    {path:'login',component:LoginComponent},
    {path:'register',component:RegisterComponent},
    {
        path:'dashboard',
        component:DashboardWrapperComponent, 
        children:[
            {
                path:'loggedin', component:DashboardComponent
            },
            {
                path:'guest', component:DashboardGuestComponent
            },
            {
                path: '', redirectTo: 'guest', pathMatch: 'full'
            }
    ]},
    {path:'user-detail/:id',component:UserDetailComponent},
    {path:'product/form',component:ProductFormComponent},
    {path:'product/form/update',component:ProductUpdateFormComponent},
    {path:'product/:id',component:ProductDetailComponent},
    {path:'communities',component:CommunityMainComponent},
    {path:'communities/form',component:CommunityFormComponent},
    {path:'communities/form/update',component:CommunityUpdateFormComponent},
    {path:'communities/:id',component:CommunityDetailComponent},
    {path:'reservations',component:ReservationOverviewComponent},
    {path:'about',component:AboutComponent},
    {path:'', redirectTo:'/dashboard',pathMatch:'full'}
];
