import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ModaleComponent} from "../../organizzazione/modale-update/modale.component";

@Component({
  selector: 'app-modale-add',
  templateUrl: './modale-add.component.html',
  styleUrls: ['./modale-add.component.css']
})
export class ModaleAddComponent {
  constructor( private ref: MatDialogRef<ModaleComponent>) {

  }

  closepopup() {
    this.ref.close('Closed using function');
  }
}
