import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from 'libs/sharemunity/features/src/lib/user/authentication.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'sharemunity-workspace-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit{
  registerForm!:FormGroup;
  authenticationService:AuthenticationService;
  
  constructor(authService:AuthenticationService, private formBuilder:FormBuilder, private router:Router){
    this.authenticationService = authService;
  }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl(null,[
        Validators.required,
      ]),
      emailAddress: new FormControl(null,[
        Validators.required,
      ]),
      password: new FormControl(null,[
        Validators.required,
      ]),
      address: new FormControl(null,[
        Validators.required
      ])
    });
    const savedData = localStorage.getItem("registerData");
    if(savedData){
      this.registerForm.setValue(JSON.parse(savedData));
    }
  }

  onSubmit(): void {
    localStorage.setItem('loginData',JSON.stringify(this.registerForm.value))
    if(this.registerForm.valid){
      const name = this.registerForm.value.name;
      const emailAddress = this.registerForm.value.emailAddress;
      const password = this.registerForm.value.password;
      const address = this.registerForm.value.address;
      this.authenticationService
      .register(name,emailAddress,password,address)
      .subscribe((user) => {
        if(user){
          console.log("Registered")
          console.log(`User: ${user.toString()}`)
          this.router.navigate(['/dashboard'])
        }
      })
    }
  }
}
