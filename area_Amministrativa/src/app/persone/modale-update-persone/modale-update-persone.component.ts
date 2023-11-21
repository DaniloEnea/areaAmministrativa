import {Component} from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-modale-update',
  templateUrl: './modale-update-persone.component.html',
  styleUrls: ['./modale-update-persone.component.css']
})
export class ModaleUpdatePersoneComponent {

  constructor(private ref: MatDialogRef<ModaleUpdatePersoneComponent>) {

  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
