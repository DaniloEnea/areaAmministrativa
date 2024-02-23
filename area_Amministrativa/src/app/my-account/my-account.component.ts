import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {AuthService} from "../service/auth.service";
import {FormGroup} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { MatDialog } from '@angular/material/dialog';
import {HttpProviderService} from "../service/http-provider.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})


export class MyAccountComponent {

  resetButtonDisabled = false;

  constructor(private toastr: ToastrService, private authService: AuthService, private dialog: MatDialog, private httpApi: HttpProviderService) {}
  username = this.authService.getUsernameFromJwt();
  role = this.authService.getRoleFromJwt();



  /*
openResetPwdDialog(username: string): void {
 const dialogRef = this.dialog.open(ResetPasswordComponent, {
   data: { Username: username} // passo l'ID
 });

 dialogRef.afterClosed().subscribe((result) => {
   console.log(`Dialog result: ${result}`);

 });
}
*/
  resetPasswordByEmail() {
    this.httpApi.forgotPwdByEmail(this.username, null).subscribe(
      {
        next: value => {
          this.toastr.success("We have sent a reset password link to your email. Please check.", "Success")
          this.resetButtonDisabled = true;
        },
        error: err => {
          this.toastr.error("Something went wrong", "Error")
        },
        complete: () => {
          setTimeout(() => {
            this.resetButtonDisabled = false;
          }, 30000);
        }
      }
    );
  }

}



