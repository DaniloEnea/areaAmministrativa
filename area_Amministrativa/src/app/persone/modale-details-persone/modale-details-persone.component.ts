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
    @Inject(MAT_DIALOG_DATA) public data: { person: PersonDTO1 },
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService) {

    this.detailsPersonForm = this.formBuilder.group({
      firstName: [this.data.person.firstName],
      lastName: [this.data.person.lastName],
      cf: [this.data.person.cf],
      organizationName: [this.data.person.organizationName],
      workRole: [this.data.person.workRole], // Imposta il valore di default
      phone: [this.data.person.phone],
      email: [this.data.person.email],
      email_2: [this.data.person.secondEmail],
      isGDPRTermsAccepted: [this.data.person.isGDPRTermsAccepted],
      isOtherProcessingPurposesAccepted: [this.data.person.isOtherProcessingPurposesAccepted],
      isServiceProcessingPurposesAccepted: [this.data.person.isServiceProcessingPurposesAccepted],
      roles: [this.data.person.roles]
    });
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
