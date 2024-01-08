import {Component} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpProviderService} from "../service/http-provider.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

export interface LoginDTO {
  username: string,
  password: string
}
@Component({
  selector: 'app-area-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './area-login.component.html',
  styleUrl: './area-login.component.css'
})
export class AreaLoginComponent {

  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private httpApi: HttpProviderService,
              private router: Router, private toastr: ToastrService) {

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.loginForm.valid) {

      const newLogin: LoginDTO = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }
      //console.log(newLogin)
      this.httpApi.login(newLogin).subscribe({
        next: value => {
          localStorage.setItem("accessToken", value.body.accessToken);
          this.toastr.success("Login successful", "Success")
          this.router.navigate([('')]).then(r => null);
        },
        error: err => {
          this.toastr.error("Incorrect username or password", "Error")
           console.log(err)
        }
      })
    }
  }

}
