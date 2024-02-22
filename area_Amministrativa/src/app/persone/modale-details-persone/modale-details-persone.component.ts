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
      firstName: [this.data.person.FirstName],
      lastName: [this.data.person.LastName],
      cf: [this.data.person.CF],
      organizationName: [this.data.person.OrganizationName],
      workRole: [this.data.person.WorkRole], // Imposta il valore di default
      phone: [this.data.person.Phone],
      email: [this.data.person.Email],
      email_2: [this.data.person.SecondEmail],
      isGDPRTermsAccepted: [this.data.person.IsGDPRTermsAccepted],
      isOtherProcessingPurposesAccepted: [this.data.person.IsOtherProcessingPurposesAccepted],
      isServiceProcessingPurposesAccepted: [this.data.person.IsServiceProcessingPurposesAccepted],
      roles: [this.data.person.Roles]
    });
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
