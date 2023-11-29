import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PersonDTO, PersonDTO1 } from "../persone.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";

@Component({
  selector: 'app-modale-add',
  templateUrl: './modale-add-persone.component.html',
  styleUrls: ['./modale-add-persone.component.css']
})

export class ModaleAddPersoneComponent {

  newPersonForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<ModaleAddPersoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonDTO,
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService) {

    this.newPersonForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      cf: ['', Validators.required],
      role: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', Validators.required],
      email_2: [''],
      gdpr_accepted: [false],
    });
  }

  onAddClick(): void {
    if (this.newPersonForm.valid) {
      const newPerson: PersonDTO1 = {
        first_name: this.newPersonForm.value.first_name,
        last_name: this.newPersonForm.value.last_name,
        cf: this.newPersonForm.value.cf,
        role: this.newPersonForm.value.role,
        phone_number: this.newPersonForm.value.phone_number,
        email: this.newPersonForm.value.email,
        email_2: this.newPersonForm.value.email_2,
        gdpr_accepted: this.newPersonForm.value.gdpr_accepted,
      };

      // post for create new user
      this.httpApi.addNewPerson(newPerson).subscribe();
    }
    this.closepopup();
    window.location.reload();
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
