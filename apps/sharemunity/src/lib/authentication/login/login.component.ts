import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'sharemunity-workspace-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit{
  loginForm!:FormGroup;
  authenticationService:AuthenticationService;

  constructor(authService:AuthenticationService, private formBuilder:FormBuilder, private router:Router){
    this.authenticationService = authService;
  }
  
  ngOnInit():void{
    this.loginForm = new FormGroup({
      emailAddress: new FormControl(null,[
        Validators.required,
      ]),
      password: new FormControl(null,[
        Validators.required,
      ]),
    });
    const savedData = localStorage.getItem("loginData");
    if(savedData){
      this.loginForm.setValue(JSON.parse(savedData))
    }
  }

  onSubmit(): void {
    localStorage.setItem('loginData', JSON.stringify(this.loginForm.value))
   if(this.loginForm.valid){
    const emailAddress = this.loginForm.value.emailAddress;
    const password = this.loginForm.value.password;
    this.authenticationService
      .login(emailAddress,password)
      .subscribe((user) => {
        if(user){
          console.log("Logged in")
          console.log(`User: ${user.toString()}`)
          this.router.navigate(['/dashboard'])
        }
      })
   } else {
      console.error("LoginForm invalid")
   }
  }
  
}
