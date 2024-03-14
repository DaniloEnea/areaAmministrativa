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
      firstName: [this.data.person.FirstName, Validators.required],
      lastName: [this.data.person.LastName, Validators.required],
      //organizationId: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
      cf: [this.data.person.CF, Validators.required],
      workRole: [this.data.person.WorkRole, Validators.required],
      phone: [this.data.person.Phone, Validators.required],
      email: [this.data.person.Email, Validators.required],
      secondEmail: new FormControl(this.data.person.SecondEmail, [Validators.email]),
      isGDPRTermsAccepted: [this.data.person.IsGDPRTermsAccepted],
      isOtherProcessingPurposesAccepted: [this.data.person.IsOtherProcessingPurposesAccepted],
      isServiceProcessingPurposesAccepted: [this.data.person.IsServiceProcessingPurposesAccepted],
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
    if (this.data.person.Email === this.auth.getUsernameFromJwt()) {
      return true;
    }
    return false;
  }

  roleCheck(role: string): boolean {
    console.log(this.data.person.Roles)
    if (this.data.person.Roles != null) {
      return this.data.person.Roles.includes(role);
    }
    else return false;
  }

  async onUpdateClick() {

    this.auth.testIsAuthenticated(async (authenticated: boolean) => {
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
            Id: this.data.person.Id,
            FirstName: this.updatePersonForm.value.firstName,
            LastName: this.updatePersonForm.value.lastName,
            OrganizationId: this.data.person.OrganizationId,
            WorkRole: this.updatePersonForm.value.workRole,
            Phone: this.updatePersonForm.value.phone.internationalNumber,
            Email: this.updatePersonForm.value.email,
            SecondEmail: this.updatePersonForm.value.secondEmail,
            HasUser: this.data.person.HasUser,
            IsGDPRTermsAccepted: this.updatePersonForm.value.isGDPRTermsAccepted,
            IsOtherProcessingPurposesAccepted: this.updatePersonForm.value.isOtherProcessingPurposesAccepted,
            IsServiceProcessingPurposesAccepted: this.updatePersonForm.value.isServiceProcessingPurposesAccepted,
            IsDeleted: false,
            IsValid: true,
            CF: this.updatePersonForm.value.cf
          };


          (await this.httpApi.updatePerson(this.data.person.Id, updatePerson)).pipe(
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
              this.dialogRef.close(updatePerson);
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            }
          });
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
