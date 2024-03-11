import {Component} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpProviderService} from "../service/http-provider.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../service/auth.service";
import {MatDialog} from '@angular/material/dialog';
import {ModaleSendEmailPwdComponent} from '../modale-send-email-pwd/modale-send-email-pwd.component';
import {EncryptionService} from "../service/encryption.service";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import config from '../conf_url.json'

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
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './area-login.component.html',
  styleUrl: './area-login.component.css'
})
export class AreaLoginComponent {

  hide: boolean = true;
  loading: boolean = false;
  loginForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private httpApi: HttpProviderService, private dialog: MatDialog,
    private router: Router, private toastr: ToastrService, private authService: AuthService, private encryptDecryptService: EncryptionService) {

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

  async submit() {
    if (this.loginForm.valid) {


      const newLogin: LoginDTO = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };

      try {
        // Cripta le credenziali di login
        const loginEncrypt = await this.httpApi.encrypt(JSON.stringify(newLogin), config.auth.authEncryption);
        this.loading = true;
        // Invia le credenziali di login criptate
        this.httpApi.loginEncrypted(loginEncrypt).subscribe({
          next: async (encryptedResponse) => {
            // Decifra la risposta
            const decryptedResponse = await this.httpApi.decrypt(encryptedResponse);
            console.log(decryptedResponse);

            localStorage.setItem("accessToken", decryptedResponse.accessToken);

            if (this.authService.isAuthenticated()) {
              this.loading = false;
              this.toastr.success("Login successful", "Success");
              await this.router.navigate([('')]);
            } else {
              this.loading = false;
              this.toastr.error("Unauthorized", "Error");
              localStorage.removeItem('accessToken');
              localStorage.removeItem('ROLE');
            }
          },
          error: err => {
            this.loading = false;
            this.toastr.error("Incorrect username or password", "Error");
            console.log(err);
          }
        });
      } catch (error) {
        console.log(error);
        this.toastr.error("Encryption failed or unable to fetch the public key", "Error");
      }

    }
  }



  openSendEmail(): void {

    const dialogRef = this.dialog.open(ModaleSendEmailPwdComponent);

  }

}
