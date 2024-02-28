import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpProviderService } from "../service/http-provider.service";
import { AuthService } from "../service/auth.service";
import { ToastrService } from 'ngx-toastr';
import { async } from 'rxjs';

@Component({
  selector: 'app-modale-delete',
  templateUrl: './modale-delete.component.html',
  styleUrls: ['./modale-delete.component.css']
})
export class ModaleDeleteComponent {

  UserExist: boolean = false;

  constructor(public auth: AuthService, private toastr: ToastrService, private ref: MatDialogRef<ModaleDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Id: string, Username: string, ClassForm : string },
    private httpApi: HttpProviderService) {
    
  }

  // delete for call DELETE API
  async confirmForm() {
    if (this.auth.isAuthenticated()) {

      (await this.httpApi.getUtenteByUsername(this.data.Username)).subscribe({
        next: (userData: any) => {
          console.log(userData.body)
          this.UserExist = true

          console.log(this.UserExist)

          if (this.UserExist === true) {
            this.deletePU();
          }
          else {
            this.deletePerson();
          }
          //this.deletePU()

          console.log("delete: " + this.data.Username)
          console.log("type: " + this.data.ClassForm)

          this.ref.close()
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
    }
    else {
      this.toastr.error("Token is expired", "Error")
      setTimeout(() => {
        window.location.reload();
      }, 500)

    }
  }


  async deletePU() {
    (await this.httpApi.deletePerson(this.data.Id)).subscribe({
      next: (value: any) => {
        this.toastr.success("Deleted succesfully", "Success")
      },
      error: (error: Error) => {
        this.toastr.error("Something went wrong with delete", "Error")
      },
      complete: () => {
        setTimeout(() => {
          this.closepopup();
          window.location.reload();
        }, 500)
      }
    })
  }

  deletePerson() {
    this.httpApi.forcedDeletePerson(this.data.Id).subscribe({
      next: (value: any) => {
        this.toastr.success("Deleted succesfully", "Success")
        this.toastr.warning("No user was found", "Warn")
      },
      error: (error: Error) => {
        this.toastr.error("Something went wrong with delete", "Error")
      },
      complete: () => {
        setTimeout(() => {
          this.closepopup();
          window.location.reload();
        }, 500)
      }
    })
  }
  

  


  closepopup() {
    this.ref.close('Closed using function');
  }
}
