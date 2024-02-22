import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpProviderService } from "../service/http-provider.service";
import { AuthService } from "../service/auth.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modale-delete',
  templateUrl: './modale-delete.component.html',
  styleUrls: ['./modale-delete.component.css']
})
export class ModaleDeleteComponent {
  constructor(public auth: AuthService, private toastr: ToastrService, private ref: MatDialogRef<ModaleDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Id: string, Username: string, ClassForm : string },
    private httpApi: HttpProviderService) { }

  UserExist: boolean = false;

  // delete for call DELETE API
  confirmForm(): void {
    if (this.auth.isAuthenticated()) {
      this.httpApi.getUtenteByUsername(this.data.Username).subscribe({
        next: (userData: any) => {
            this.UserExist = true
        }
      })

      //if (this.data.ClassForm == "User") {
      //  //this.httpApi.deleteUser(this.data.Id).subscribe()
      //}
      //else if (this.data.ClassForm == "People") {
      //  this.deletePU()
      //}
      //else if (this.data.ClassForm == "Organization") {
      //  //this.httpApi.deleteOrg(this.data.Id).subscribe()
      //}
      this.deletePU()

      console.log("delete: " + this.data.Username)
      console.log("type: " + this.data.ClassForm)

      this.ref.close()
    }
    else {
      this.toastr.error("Token is expired", "Error")
      setTimeout(() => {
        //window.location.reload();
      }, 500)
      
    }
  }


  deletePU() {
    if (this.UserExist === true) {
      this.httpApi.deletePerson(this.data.Id).subscribe({
        next: (value: any) => {
          this.toastr.success("Deleted succesfully", "Success")
          setTimeout(() => {
            window.location.reload();
          }, 500)
        },
        error: (error: Error) => {
          this.toastr.error("Something went wrong with delete", "Error")
        }
      })
    }
    else {
      this.httpApi.forcedDeletePerson(this.data.Id).subscribe({
        next: (value: any) => {
          this.toastr.success("Deleted succesfully", "Success")
          this.toastr.warning("No user was found", "Warn")
          setTimeout(() => {
            window.location.reload();
          }, 500)
        },
        error: (error: Error) => {
          this.toastr.error("Something went wrong with delete", "Error")
        }
      })
    }
  }
  

  closepopup() {
    this.ref.close('Closed using function');
  }
}
