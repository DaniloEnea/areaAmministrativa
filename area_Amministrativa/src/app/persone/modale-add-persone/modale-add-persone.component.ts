import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PersonDTO, PersonDTO1 } from "../persone.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";
import {ToastrService} from "ngx-toastr";

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
    private httpApi: HttpProviderService, private toastr: ToastrService) {

    this.newPersonForm = this.formBuilder.group({
      //id: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      //organizationId: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      cf: ['', Validators.required],
      workRole: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      secondEmail: [''],
      isGDPRTermsAccepted: [false],
      isOtherProcessingPurposesAccepted: [true],
      isServiceProcessingPurposesAccepted: [true],
      IsValid: [true],
      IsDeleted: [false],
    });
  }

  onAddClick(): void {
    if (this.newPersonForm.valid) {
        console.log("test 1")
      const newPerson: PersonDTO1 = {
        firstName: this.newPersonForm.value.firstName,
        lastName: this.newPersonForm.value.lastName,
        cf: this.newPersonForm.value.cf,
        workRole: this.newPersonForm.value.workRole,
        phone: this.newPersonForm.value.phone,
        email: this.newPersonForm.value.email,
        secondEmail: this.newPersonForm.value.secondEmail,
        isGDPRTermsAccepted: this.newPersonForm.value.isGDPRTermsAccepted,
        isOtherProcessingPurposesAccepted: this.newPersonForm.value.isOtherProcessingPurposesAccepted,
        isServiceProcessingPurposesAccepted: this.newPersonForm.value.isServiceProcessingPurposesAccepted,
        IsValid: this.newPersonForm.value.IsValid,
        IsDeleted: this.newPersonForm.value.IsDeleted
      };
      console.log(newPerson)

      // post for create new user
      this.httpApi.addNewPerson(newPerson).subscribe({
        next: value => {
          this.toastr.success("Data updated successfully", "Success");
           setTimeout(() => {
                window.location.reload();
              }, 1000)
        },
        error: err => {
          this.toastr.error('Something is wrong', 'Error');
        }
      });
    }
    this.closepopup();
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
