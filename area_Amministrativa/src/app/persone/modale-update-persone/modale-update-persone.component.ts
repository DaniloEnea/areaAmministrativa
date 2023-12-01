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
        first_name: [this.data.person.first_name, Validators.required],
        last_name: [this.data.person.last_name, Validators.required],
        cf: [this.data.person.cf, Validators.required],
        work_role: [this.data.person.work_role, Validators.required], // Imposta il valore di default
        phone_number: [this.data.person.phone_number, Validators.required],
        email: [this.data.person.email, Validators.required],
        email_2: [this.data.person.email_2],
        gdpr_accepted: [this.data.person.gdpr_accepted],
      });
    }

  onUpdateClick(): void {
    if (this.updatePersonForm.valid) {
      const updatePerson: PersonDTO1 = {
        first_name: this.updatePersonForm.value.first_name,
        last_name: this.updatePersonForm.value.last_name,
        cf: this.updatePersonForm.value.cf,
        work_role: this.updatePersonForm.value.work_role,
        phone_number: this.updatePersonForm.value.phone_number,
        email: this.updatePersonForm.value.email,
        email_2: this.updatePersonForm.value.email_2,
        gdpr_accepted: this.updatePersonForm.value.gdpr_accepted,
      };

      // post for create new user
      this.httpApi.updatePerson(this.data.person.id, updatePerson).subscribe();
      this.dialogRef.close(updatePerson);
      window.location.reload();
    }
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
