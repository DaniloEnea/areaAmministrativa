import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {AuthService} from "../service/auth.service";
import {FormGroup} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private authService: AuthService, private dialog: MatDialog) {}
     username = this.authService.getUsernameFromJwt();
     role = this.authService.getRoleFromJwt();

  openResetPwdDialog(username: string): void {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      data: { Username: username} // passo l'ID
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);

    });
  }
}



