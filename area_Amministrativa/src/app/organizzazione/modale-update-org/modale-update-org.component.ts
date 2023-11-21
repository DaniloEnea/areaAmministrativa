import {Component} from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-modale-update',
  templateUrl: './modale-update-org.component.html',
  styleUrls: ['./modale-update-org.component.css']
})
export class ModaleUpdateOrgComponent {

  constructor(private ref: MatDialogRef<ModaleUpdateOrgComponent>) {

  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
