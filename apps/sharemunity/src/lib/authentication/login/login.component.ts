import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { IUser } from '@sharemunity-workspace/shared/api';

@Component({
  selector: 'sharemunity-workspace-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly LOGIN_DATA = 'loginData';
  protected user:IUser | null = null;

  errorMessage:string | null = null;
  
  loginForm!: FormGroup;
  authenticationService: AuthenticationService;
    
  constructor(
    authService: AuthenticationService,
    private router: Router
  ) {
    this.authenticationService = authService;
  }

  ngOnInit(): void {
  this.authenticationService.user$.subscribe(user => {
    this.user = user;
    if (this.user != null) {
      console.log(this.user.name);
      this.router.navigate(['/dashboard']);
    }
  });
    this.loginForm = new FormGroup({
      emailAddress: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
    const savedData = localStorage.getItem(this.LOGIN_DATA);
    if (savedData) {
      this.loginForm.setValue(JSON.parse(savedData));
    }
  }

  onSubmit(): void {
    localStorage.setItem(this.LOGIN_DATA, JSON.stringify(this.loginForm.value));
    if (this.loginForm.valid) {
      const emailAddress = this.loginForm.value.emailAddress;
      const password = this.loginForm.value.password;
      this.authenticationService
        .login(emailAddress, password)
        .subscribe({
          next: (user) =>{
            if (user) {
              console.log('Routing towards');
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error) => {
            this.errorMessage = `Invalid email or password`;
          }
        });
    } else {
      console.error('LoginForm invalid');
    }
  }
}
