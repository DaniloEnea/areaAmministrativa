import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PersonDTO, PersonDTO1, PersonDTO2 } from "../persone.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../service/auth.service";

export interface Roles {
  Role_SA: boolean;
  Role_User: boolean;
  Role_Admin: boolean;
}

@Component({
  selector: 'app-modale-add',
  templateUrl: './modale-add-persone.component.html',
  styleUrls: ['./modale-add-persone.component.css']
})

export class ModaleAddPersoneComponent {

  test: string[] = [
    'ROLE_USER',
    'ROLE_ADMIN'
  ]

  newPersonForm: FormGroup;
  rolesSelected: string[] = [];
  IsSA = true;

  constructor(public auth: AuthService, public dialogRef: MatDialogRef<ModaleAddPersoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person: PersonDTO1, roles: Roles },
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService, private toastr: ToastrService) {

    this.IsSA = auth.checkIsSA();
    this.newPersonForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      cf: ['', Validators.required],
      workRole: ['', Validators.required],
      phone: ['', Validators.required],
      email: new FormControl('', [ Validators.email, Validators.required ]),
      secondEmail:  new FormControl(null, [ Validators.email]),
      isGDPRTermsAccepted: [false],
      isOtherProcessingPurposesAccepted: [true],
      isServiceProcessingPurposesAccepted: [false],
      Role_SA: [false],
      Role_Admin: [false],
      Role_User: [true]
    });
  }

  get email() { return this.newPersonForm.get('email'); }

  get secondEmail() { return this.newPersonForm.get('secondEmail'); }

  // @ts-ignore
  getEmailError() {
    // @ts-ignore
    if (this.email.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    // @ts-ignore
    if (this.email.hasError('required')) {
      return 'An Email is required.';
    }
  }

  // @ts-ignore
  getSecondEmailError() {
    // @ts-ignore
    if (this.secondEmail.hasError('email')) {
      return 'Please enter a valid email address.';
    }
  }

  onAddClick(): void {
    if (this.auth.isAuthenticated()) {
      if (this.newPersonForm.valid) {

        if (this.newPersonForm.value.Role_SA == true) {
          this.rolesSelected.push("ROLE_SA")
        }
        if (this.newPersonForm.value.Role_Admin == true) {
          this.rolesSelected.push("ROLE_USER")
        }
        if (this.newPersonForm.value.Role_User == true) {
          this.rolesSelected.push("ROLE_ADMIN")
        }


        console.log("test 1")
        const newPerson: PersonDTO2 = {
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
          roles:
            this.rolesSelected

        };
        console.log(newPerson)



        // post for create new user
        this.httpApi.addNewPerson(newPerson).subscribe({
          next: value => {
            this.toastr.success("Data updated successfully", "Success");
            setTimeout(() => {
              console.log(newPerson)
              //window.location.reload();
            }, 1000)
          },
          error: err => {
            this.toastr.error('Something is wrong', 'Error');
            setTimeout(() => { }, 1500)
          }
        });
      }
      this.closepopup();
    }
    else {
      this.toastr.error("Token is expired", "Error")
      setTimeout(() => {
        window.location.reload();
      }, 500)

    }
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
