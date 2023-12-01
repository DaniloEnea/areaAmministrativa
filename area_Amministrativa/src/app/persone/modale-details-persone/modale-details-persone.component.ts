import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PersonDTO, PersonDTO1 } from "../persone.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";

@Component({
  selector: 'app-modale-details-persone',
  templateUrl: './modale-details-persone.component.html',
  styleUrls: ['./modale-details-persone.component.css']
})
export class ModaleDetailsPersoneComponent {
  detailsPersonForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<ModaleDetailsPersoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person: PersonDTO },
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService) {

    this.detailsPersonForm = this.formBuilder.group({
      first_name: [this.data.person.first_name],
      last_name: [this.data.person.last_name],
      cf: [this.data.person.cf],
      work_role: [this.data.person.work_role], // Imposta il valore di default
      phone_number: [this.data.person.phone_number],
      email: [this.data.person.email],
      email_2: [this.data.person.email_2],
      gdpr_accepted: [this.data.person.gdpr_accepted],
    });
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
