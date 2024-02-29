import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { HttpProviderService } from '../service/http-provider.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modale-send-email-pwd',
  templateUrl: './modale-send-email-pwd.component.html',
  styleUrl: './modale-send-email-pwd.component.css'
})
export class ModaleSendEmailPwdComponent {
  sendEmailForm: FormGroup;

  constructor(public auth: AuthService, private route: ActivatedRoute, public dialogRef: MatDialogRef<ModaleSendEmailPwdComponent>, private formBuilder: FormBuilder, private httpApi: HttpProviderService, private toastr: ToastrService) {

    this.sendEmailForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

  }

  sendEmail() {
    if (this.sendEmailForm.valid) {
      this.httpApi.forgotPwdByEmail(this.sendEmailForm.value.email).subscribe(
        {
          next: value => {
            this.toastr.success("We have sent a reset password link to your email. Please check.", "Success")
          },
          error: err => {
            this.toastr.error("Something goes wrong", "Error")
          }
        }
      );
    }
  }

  closepopup() {
    this.dialogRef.close();
  }
}
