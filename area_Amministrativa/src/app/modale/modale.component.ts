import {Component} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-modale',
  templateUrl: './modale.component.html',
  styleUrls: ['./modale.component.css']
})
export class ModaleComponent {

  constructor( private ref: MatDialogRef<ModaleComponent>) {

  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
