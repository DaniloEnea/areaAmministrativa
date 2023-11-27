import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {HttpProviderService} from "../service/http-provider.service";

@Component({
  selector: 'app-modale-delete',
  templateUrl: './modale-delete.component.html',
  styleUrls: ['./modale-delete.component.css']
})
export class ModaleDeleteComponent {
  constructor(private ref: MatDialogRef<ModaleDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Id: number, ClassForm : string },
               private httpApi: HttpProviderService) {}

  // delete for call DELETE API
  confirmForm(): void {
    if (this.data.ClassForm == "User") {
      this.httpApi.deleteUser(this.data.Id).subscribe()
    }
    else if (this.data.ClassForm == "People") {
      this.httpApi.deletePerson(this.data.Id).subscribe()
    }
    else if (this.data.ClassForm == "Organization") {
      this.httpApi.deleteOrg(this.data.Id).subscribe()
    }

    console.log("delete: " + this.data.Id)
    console.log("type: " + this.data.ClassForm)

    this.ref.close()
    window.location.reload();
  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
