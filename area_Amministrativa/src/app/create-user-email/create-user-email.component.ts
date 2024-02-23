import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpProviderService } from '../service/http-provider.service';

export interface PasswordDTO {
  password: string;
  checkPwd: string;
}
export interface SendPasswordDTO {
  password: string;
}

@Component({
  selector: 'app-create-user-email',
  templateUrl: './create-user-email.component.html',
  styleUrl: './create-user-email.component.css'
})
export class CreateUserEmailComponent {
  hide1: boolean = true;
  hide2: boolean = true;
  PasswordDTOForm: FormGroup;

  constructor(public auth: AuthService, private toastr: ToastrService, private ref: MatDialogRef<CreateUserEmailComponent>, private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { Username: string, passwordDTO: PasswordDTO },
    private httpApi: HttpProviderService) {

    this.PasswordDTOForm = this.formBuilder.group({
      password: [(this.data.passwordDTO ? this.data.passwordDTO.password : ''), Validators.required],
      checkPwd: [(this.data.passwordDTO ? this.data.passwordDTO.checkPwd : ''), Validators.required],
    });
  }

  get visibilityIconPwd(): string {
    return this.hide1 ? 'visibility_off' : 'visibility';
  }
  get visibilityIconCheckPwd(): string {
    return this.hide2 ? 'visibility_off' : 'visibility';
  }

  changePwd(): void {
    if (this.auth.isAuthenticated()) {
      if (this.PasswordDTOForm.valid) {

        if (this.PasswordDTOForm.value.password == this.PasswordDTOForm.value.checkPwd) {
          const changePassword: SendPasswordDTO = {
            password: this.PasswordDTOForm.value.password
          };

          this.httpApi.resetPwd(this.data.Username).subscribe(
            {
              next: value => {
                this.toastr.success("Password changed correctly", "Success")
              },
              error: err => {
                this.toastr.success("Something goes wrong", "Error")
              }
            }
          )
          this.ref.close()
        } else {
          this.toastr.error("Passwords don't match", "Error")
        }
      }
    } else {
      this.toastr.error("Token is expired", "Error")
      setTimeout(() => {
        window.location.reload();
      }, 500)
    }
  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
