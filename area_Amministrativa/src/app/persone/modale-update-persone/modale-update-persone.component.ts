import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PersonDTO, PersonDTO1 } from "../persone.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";

@Component({
  selector: 'app-modale-update',
  templateUrl: './modale-update-persone.component.html',
  styleUrls: ['./modale-update-persone.component.css']
})
export class ModaleUpdatePersoneComponent {
  
    updatePersonForm: FormGroup;
    constructor(public dialogRef: MatDialogRef<ModaleUpdatePersoneComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { person: PersonDTO },
      private formBuilder: FormBuilder,
      private httpApi: HttpProviderService) {

      this.updatePersonForm = this.formBuilder.group({
        //id: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        firstName: [this.data.person.firstName, Validators.required],
        lastName: [this.data.person.lastName, Validators.required],
        //organizationId: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        cf: [this.data.person.cf, Validators.required],
        workRole: [this.data.person.workRole, Validators.required],
        phone: [this.data.person.phone, Validators.required],
        email: [this.data.person.email, Validators.required],
        secondEmail: [this.data.person.secondEmail],
        isGDPRTermsAccepted: [this.data.person.isGDPRTermsAccepted],
        isOtherProcessingPurposesAccepted: [true],
        isServiceProcessingPurposesAccepted: [true],
        IsValid: [true],
        IsDeleted: [false],
      });
    }

  onUpdateClick(): void {
    if (this.updatePersonForm.valid) {
      const updatePerson: PersonDTO = {
        id: this.data.person.id,
        firstName: this.updatePersonForm.value.firstName,
        lastName: this.updatePersonForm.value.lastName,
        organizationId: this.data.person.organizationId,
        cf: this.updatePersonForm.value.cf,
        workRole: this.updatePersonForm.value.workRole,
        phone: this.updatePersonForm.value.phone,
        email: this.updatePersonForm.value.email,
        secondEmail: this.updatePersonForm.value.secondEmail,
        isGDPRTermsAccepted: this.updatePersonForm.value.isGDPRTermsAccepted,
        isOtherProcessingPurposesAccepted: this.updatePersonForm.value.isOtherProcessingPurposesAccepted,
        isServiceProcessingPurposesAccepted: this.updatePersonForm.value.isServiceProcessingPurposesAccepted,
        IsValid: this.updatePersonForm.value.IsValid,
        IsDeleted: this.updatePersonForm.value.IsDeleted
      };

      //post for create new user
      console.log(this.data.person.id)
      this.httpApi.updatePerson(this.data.person.id, updatePerson).subscribe();
      this.dialogRef.close(updatePerson);
      window.location.reload();
    }
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
