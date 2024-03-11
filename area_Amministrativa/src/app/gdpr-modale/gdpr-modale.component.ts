import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-gdpr-modale',
  templateUrl: './gdpr-modale.component.html',
  styleUrl: './gdpr-modale.component.css'
})
export class GdprModaleComponent {

  constructor(private ref: MatDialogRef<GdprModaleComponent>) {}

  closepopup() {
    this.ref.close('Closed using function');
  }
}
