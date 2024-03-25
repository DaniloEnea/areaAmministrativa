import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PersonDTO, PersonDTO1, PersoneComponent } from "../persone.component";
import { OrganizationDTO } from "src/app/organizzazione/organizzazione.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../service/auth.service";
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import {filter, from, mergeMap, tap} from 'rxjs';
import {BodyDtoEncrypt} from "../../dto/body-dto-encrypt";
import {request} from "express";



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
  IsSameUser = false;
  IsSA = true;
  wantToUpdateUser: boolean = true;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(public auth: AuthService, public dialogRef: MatDialogRef<ModaleUpdatePersoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person: PersonDTO1 },
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService, private toastr: ToastrService) {


    this.IsSameUser = this.checkIfSameUser();
    this.IsSA = auth.checkIsSA();

    this.updatePersonForm = this.formBuilder.group({
      //id: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      firstName: [this.data.person.firstName, Validators.required],
      lastName: [this.data.person.lastName, Validators.required],
      //organizationId: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      cf: [this.data.person.cf, Validators.required],
      workRole: [this.data.person.workRole, Validators.required],
      phone: [this.data.person.phone, Validators.required],
      email: [this.data.person.email, Validators.required],
      secondEmail: new FormControl(this.data.person.secondEmail, [Validators.email]),
      isGDPRTermsAccepted: [this.data.person.isGDPRTermsAccepted],
      isOtherProcessingPurposesAccepted: [this.data.person.isOtherProcessingPurposesAccepted],
      isServiceProcessingPurposesAccepted: [this.data.person.isServiceProcessingPurposesAccepted],
      wantToUpdateUser: [false],
      Role_SA: [this.roleCheck("ROLE_SA")],
      Role_Admin: [this.roleCheck("ROLE_ADMIN")]
    });
  }

  get workRole() { return this.updatePersonForm.get('workRole'); }
  get secondEmail() { return this.updatePersonForm.get('secondEmail'); }

  // @ts-ignore
  getWorkroleError() {
    // @ts-ignore
    if (this.workRole.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getSecondEmailError() {
    // @ts-ignore
    if (this.secondEmail.hasError('email')) {
      return 'Please enter a valid email address.';
    }
  }

  checkIfSameUser(): boolean {
    if (this.data.person.email === this.auth.getUsernameFromJwt()) {
      return true;
    }
    return false;
  }

  roleCheck(role: string): boolean {
    console.log(this.data.person.roles)
    if (this.data.person.roles != null) {
      return this.data.person.roles.includes(role);
    }
    else return false;
  }

  onUpdateClick() {

    this.auth.testIsAuthenticated((authenticated: boolean) => {
      if (authenticated) {
        if (this.updatePersonForm.valid) {

          if (this.updatePersonForm.value.Role_SA == true) {
            this.rolesSelected.push("ROLE_SA")
          }
          if (this.updatePersonForm.value.Role_Admin == true) {
            this.rolesSelected.push("ROLE_ADMIN")
          }
          this.rolesSelected.push("ROLE_USER")

          this.wantToUpdateUser = this.updatePersonForm.value.wantToUpdateUser;

          console.log(this.rolesSelected)

          const updatePerson: PersonDTO = {
            id: this.data.person.id,
            firstName: this.updatePersonForm.value.firstName,
            lastName: this.updatePersonForm.value.lastName,
            organizationId: this.data.person.organizationId,
            workRole: this.updatePersonForm.value.workRole,
            phone: this.updatePersonForm.value.phone.internationalNumber,
            email: this.updatePersonForm.value.email,
            secondEmail: this.updatePersonForm.value.secondEmail,
            hasUser: this.data.person.hasUser,
            isGDPRTermsAccepted: this.updatePersonForm.value.isGDPRTermsAccepted,
            isOtherProcessingPurposesAccepted: this.updatePersonForm.value.isOtherProcessingPurposesAccepted,
            isServiceProcessingPurposesAccepted: this.updatePersonForm.value.isServiceProcessingPurposesAccepted,
            isDeleted: false,
            isValid: true,
            cf: this.updatePersonForm.value.cf
          };


          this.httpApi.updatePerson(this.data.person.id, updatePerson).pipe(
            tap(() => {
              console.log("riuscito");
              this.toastr.success("Person updated successfully", "Success");
            }),
            filter(() => this.updatePersonForm.value.wantToUpdateUser === true),
            mergeMap(() => this.httpApi.changeRole(this.updatePersonForm.value.email, this.rolesSelected)),
            tap({
              next: () => {
                this.toastr.success("User updated successfully", "Success");
              },
              error: (err: Error) => {
                console.log("Fallito");
                console.log(err);
                this.toastr.error('Something is wrong', 'Error');
              }
            }),
          ).subscribe({
            complete: () => {
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          });
              this.dialogRef.close(updatePerson);
        }
      } else {
        this.toastr.error("Token is expired", "Error")
        setTimeout(() => {
          window.location.reload();
        }, 500)
      }
    });

  }


  closepopup(): void {
    this.dialogRef.close();
  }
}
