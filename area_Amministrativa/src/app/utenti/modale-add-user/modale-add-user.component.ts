import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-modale-add',
  templateUrl: './modale-add-user.component.html',
  styleUrls: ['./modale-add-user.component.css']
})
export class ModaleAddUserComponent {
  constructor(private ref: MatDialogRef<ModaleAddUserComponent>) {

  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
