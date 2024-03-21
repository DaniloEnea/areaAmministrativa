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
  
  constructor(public auth: AuthService, private toastr: ToastrService, private ref: MatDialogRef<ModaleDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Id: string, Username: string, FirstName: string, LastName: string, HasUser: boolean },
    private httpApi: HttpProviderService) {

  }

  // delete for call DELETE API
  confirmForm() {
    this.auth.testIsAuthenticated((authenticated: boolean) => {
      if (authenticated) {
        if (this.data.HasUser) {
          this.deletePU() // delete with user
        }
        else {
          this.deletePerson()
        }
        this.closepopup()
      } else {
        this.toastr.error("Token is expired", "Error")
        setTimeout(() => {
          window.location.reload();
        }, 1000)

      }
    });
  }


  deletePU() {
    (this.httpApi.deletePerson(this.data.Id)).subscribe({
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
        }, 1000)
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
        }, 1000)
      }
    })
  }





  closepopup() {
    this.ref.close('Closed using function');
  }
}
