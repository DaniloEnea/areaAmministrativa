import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modale-add',
  templateUrl: './modale-add-persone.component.html',
  styleUrls: ['./modale-add-persone.component.css']
})
export class ModaleAddPersoneComponent {
  constructor(private ref: MatDialogRef<ModaleAddPersoneComponent>) {

  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
