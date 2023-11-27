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
              @Inject(MAT_DIALOG_DATA) public data: { userId: number },
               private httpApi: HttpProviderService) {}

  // delete for call DELETE API
  confirmForm(): void {
    this.httpApi.deleteUser(this.data.userId).subscribe()
    console.log("delete: " + this.data.userId)
     this.ref.close()
  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
