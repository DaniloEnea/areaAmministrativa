import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PersonDTO, PersonDTO1 } from "../persone.component";
import { OrganizationDTO } from "src/app/organizzazione/organizzazione.component";
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
  selector: 'app-modale-update',
  templateUrl: './modale-update-persone.component.html',
  styleUrls: ['./modale-update-persone.component.css']
})

export class ModaleUpdatePersoneComponent {

  updatePersonForm: FormGroup;
  rolesSelected: string[] = [];

  constructor(public auth: AuthService, public dialogRef: MatDialogRef<ModaleUpdatePersoneComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { person: PersonDTO1 },
      private formBuilder: FormBuilder,
      private httpApi: HttpProviderService, private toastr: ToastrService) {

      this.updatePersonForm = this.formBuilder.group({
        //id: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        firstName: [this.data.person.firstName, Validators.required],
        lastName: [this.data.person.lastName, Validators.required],
        //organizationId: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        cf: [this.data.person.cf, Validators.required],
        workRole: [this.data.person.workRole, Validators.required],
        phone: [this.data.person.phone, Validators.required],
        email: [this.data.person.email, Validators.required],
        secondEmail: [this.data.person.secondEmail, Validators.email],
        isGDPRTermsAccepted: [this.data.person.isGDPRTermsAccepted],
        isOtherProcessingPurposesAccepted: [this.data.person.isOtherProcessingPurposesAccepted],
        isServiceProcessingPurposesAccepted: [this.data.person.isServiceProcessingPurposesAccepted],
        Role_SA: [this.roleCheck("ROLE_SA")],
        Role_Admin: [this.roleCheck("ROLE_ADMIN")],
        Role_User: [this.roleCheck("ROLE_USER")]
      });
  }


  get secondEmail() { return this.updatePersonForm.get('secondEmail'); }

  // @ts-ignore
  getSecondEmailError() {
    // @ts-ignore
    if (this.secondEmail.hasError('email')) {
      return 'Please enter a valid email address.';
    }
  }

  roleCheck(role: string): boolean {
    if (this.data.person.roles != null) {
      return this.data.person.roles.includes(role);
    }
    else return false;
  }

  updateOrg(orgid: string): string {
    return ""
  }

  onUpdateClick(): void {
    if (this.auth.isAuthenticated()) {
      if (this.updatePersonForm.valid) {

        if (this.updatePersonForm.value.Role_SA == true) {
          this.rolesSelected.push("ROLE_SA")
        }
        if (this.updatePersonForm.value.Role_Admin == true) {
          this.rolesSelected.push("ROLE_USER")
        }
        if (this.updatePersonForm.value.Role_User == true) {
          this.rolesSelected.push("ROLE_ADMIN")
        }

        console.log(this.rolesSelected)

        const updatePerson: PersonDTO = {
            id: this.data.person.id,
            firstName: this.updatePersonForm.value.firstName,
            lastName: this.updatePersonForm.value.lastName,
            organizationId: this.data.person.organizationId,
            workRole: this.updatePersonForm.value.workRole,
            phone: this.updatePersonForm.value.phone,
            email: this.updatePersonForm.value.email,
            secondEmail: this.updatePersonForm.value.secondEmail,
            isGDPRTermsAccepted: this.updatePersonForm.value.isGDPRTermsAccepted,
            isOtherProcessingPurposesAccepted: this.updatePersonForm.value.isOtherProcessingPurposesAccepted,
            isServiceProcessingPurposesAccepted: this.updatePersonForm.value.isServiceProcessingPurposesAccepted,
            IsDeleted: false,
            IsValid: true,
            cf: this.updatePersonForm.value.cf
        };

        //post for create new user
        this.httpApi.updatePerson(this.data.person.id, updatePerson).subscribe(
          (response) => {
            this.httpApi.changeRole(this.data.person.email, this.rolesSelected).subscribe((response) => {
              this.toastr.success("Data updated successfully", "Success");
              setTimeout(() => {
                window.location.reload();
              }, 1500)
            })
          },
          (error) => {
            // show the error
            this.toastr.error('Something is wrong', 'Error');
            setTimeout(() => { }, 1500)
          }
        );
        this.dialogRef.close(updatePerson);
      }
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
