import {Component} from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-modale-update',
  templateUrl: './modale-update-user.component.html',
  styleUrls: ['./modale-update-user.component.css']
})
export class ModaleUpdateUserComponent {

  constructor(private ref: MatDialogRef<ModaleUpdateUserComponent>) {

  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
