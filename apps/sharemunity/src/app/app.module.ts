import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { NxWelcomeComponent } from "./nx-welcome.component";
import { BrowserModule } from "@angular/platform-browser";
import { RouterLink, RouterLinkActive, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FeaturesModule } from "@sharemunity-workspace/sharemunity/features";
import { LoginComponent } from "../lib/authentication/login/login.component";
import { RegisterComponent } from "../lib/authentication/register/register.component";
import { NavbarComponent } from "../lib/layout/navbar/navbar.component";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "../lib/pages/dashboard/dashboard.component";
import { FooterComponent } from "../lib/layout/footer/footer.component";
import { appRoutes } from "./app.routes";
import { DashboardGuestComponent } from "../lib/pages/dashboard-guest/dashboard-guest.component";
import { DashboardWrapperComponent } from "../lib/pages/dashboard-wrapper/dashboard-wrapper.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 
    RegisterComponent, 
    NavbarComponent,    
    DashboardComponent,
    DashboardGuestComponent,
    DashboardWrapperComponent,
    FooterComponent,
      ],
  imports: [
    BrowserModule,      // Required for bootstrapping
    RouterLink,
    RouterLinkActive, 
    RouterModule.forRoot(appRoutes),
    FormsModule,
    FeaturesModule,
    CommonModule, 
    ReactiveFormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent], // Bootstrap AppComponent
})
export class AppModule { }
