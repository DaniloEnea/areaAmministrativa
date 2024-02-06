import {Component} from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpProviderService} from "../service/http-provider.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../service/auth.service";
import { MatDialog } from '@angular/material/dialog';
import { ModaleSendEmailPwdComponent } from '../modale-send-email-pwd/modale-send-email-pwd.component';

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
    MatIconModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './area-login.component.html',
  styleUrl: './area-login.component.css'
})
export class AreaLoginComponent {

  hide: boolean = true;
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private httpApi: HttpProviderService, private dialog: MatDialog,
    private router: Router, private toastr: ToastrService, private authService: AuthService) {

    if (authService.isAuthenticated() == true) {
      this.router.navigate([('')]);
      this.toastr.info("You are already logged in", "Info")
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]

    });
  }

  get visibilityIcon(): string {
    return this.hide ? 'visibility_off' : 'visibility';
  }

  submit() {
    if (this.loginForm.valid) {

      const newLogin: LoginDTO = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }
      //console.log(newLogin)
      this.httpApi.loginEncrypted(newLogin).subscribe({
        next: value => {
          localStorage.setItem("accessToken", value.body.accessToken);
          if (this.authService.isAuthenticated()) {
            this.toastr.success("Login successful", "Success")
            this.router.navigate([('')]).then(r => null);
          }
          else {
            this.toastr.error("Unauthorized", "Error");
            localStorage.removeItem('accessToken');
            localStorage.removeItem('ROLE');
          }
        },
        error: err => {
          this.toastr.error("Incorrect username or password", "Error")
          console.log(err)
        }
      })
    }
  }

  openSendEmail(): void {

    const dialogRef = this.dialog.open(ModaleSendEmailPwdComponent);

  }

}
