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

  private readonly REGISTER_DATA = "registerData";
  
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
        Validators.email
      ]),
      password: new FormControl(null,[
        Validators.required,
      ]),
      address: new FormControl(null,[
        Validators.required
      ])
    });
    const savedData = localStorage.getItem(this.REGISTER_DATA);
    if(savedData){
      this.registerForm.setValue(JSON.parse(savedData));
    }
  }

  onSubmit(): void {
    localStorage.setItem(this.REGISTER_DATA,JSON.stringify(this.registerForm.value))
    console.log("validating")
    if(this.registerForm.valid){
      const name = this.registerForm.value.name;
      const emailAddress = this.registerForm.value.emailAddress;
      const password = this.registerForm.value.password;
      const address = this.registerForm.value.address;
      this.authenticationService
      .register(name,emailAddress,password,address)
      .subscribe((user) => {
        if(user){
          if(localStorage.getItem(this.REGISTER_DATA) != null){
            localStorage.removeItem(this.REGISTER_DATA);
          }
          this.router.navigate(['/dashboard'])
        }
      })
    }
  }
}
