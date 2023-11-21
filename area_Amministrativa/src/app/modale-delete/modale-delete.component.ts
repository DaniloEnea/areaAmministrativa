import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modale-delete',
  templateUrl: './modale-delete.component.html',
  styleUrls: ['./modale-delete.component.css']
})
export class ModaleDeleteComponent {
  constructor(private ref: MatDialogRef<ModaleDeleteComponent>) {

  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
