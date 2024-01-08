import { Component, Inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpProviderService } from '../service/http-provider.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PasswordDTO {
  password: string;
  checkPwd: string;
}
export interface SendPasswordDTO {
  password: string;
}


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  
  PasswordDTOForm: FormGroup;

  constructor(public auth: AuthService, private toastr: ToastrService, private ref: MatDialogRef<ResetPasswordComponent>, private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { Username: string, passwordDTO:PasswordDTO},
    private httpApi: HttpProviderService) {

    this.PasswordDTOForm = this.formBuilder.group({
      password: [(this.data.passwordDTO ? this.data.passwordDTO.password : ''), Validators.required],
      checkPwd: [(this.data.passwordDTO ? this.data.passwordDTO.checkPwd : ''), Validators.required],
    });
  }


  changePwd(): void {
    if (this.auth.isAuthenticated()) {
      if (this.PasswordDTOForm.valid) {

        if (this.PasswordDTOForm.value.password == this.PasswordDTOForm.value.checkPwd) {
          const changePassword: SendPasswordDTO = {
            password: this.PasswordDTOForm.value.password
          };

          this.httpApi.resetPwd(this.data.Username, changePassword).subscribe()
          this.toastr.success("Password changed correctly", "Success")
          this.ref.close()
        }
        else {
          this.toastr.error("Passwords don't match", "Error")
        }

      }
      else {
        this.toastr.error("Token is expired", "Error")
        setTimeout(() => {
          window.location.reload();
        }, 500)
      }
    }
  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
