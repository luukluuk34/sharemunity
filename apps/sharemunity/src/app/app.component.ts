import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { FeaturesModule } from '@sharemunity-workspace/sharemunity/features'
import { LoginComponent } from "../lib/authentication/login/login.component";
import { RegisterComponent } from "../lib/authentication/register/register.component";
import { NavbarComponent } from "../lib/layout/navbar/navbar.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [
    NxWelcomeComponent,
    RouterModule, 
    RouterLink,
    RouterLinkActive, 
    ReactiveFormsModule,
    FormsModule,
    FeaturesModule, 
    LoginComponent, 
    RegisterComponent, 
    NavbarComponent],
  selector: 'sharemunity-workspace-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'sharemunity';
}
