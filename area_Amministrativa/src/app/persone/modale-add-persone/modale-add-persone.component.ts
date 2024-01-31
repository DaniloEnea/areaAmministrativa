import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PersonDTO, PersonDTO1, PersonDTO2 } from "../persone.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../service/auth.service";
import { Observable } from 'rxjs';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';


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
  organizations: any[] = [];
  organizationId = "";
  IsSA = true;
  RoleSa = false;
  RoleAdmin = false;
  RoleUser = false;

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(public auth: AuthService, public dialogRef: MatDialogRef<ModaleAddPersoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person: PersonDTO1, roles: Roles },
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService, private toastr: ToastrService) {

    this.IsSA = auth.checkIsSA();

    if (this.IsSA === true) {
      this.httpApi.getAllOrg().subscribe({
        next: (data: any) => {

          if (data != null && data.body != null) {
            this.organizations = data.body;
            console.log(this.organizations);
          }

        },
        error: (error) => {
          console.error('Errore durante il recupero delle organizzazioni', error);
        }
      });

    }

    this.newPersonForm = this.setFormBuilder();

  }

  get firstName() { return this.newPersonForm.get('firstName'); }
  get lastName() { return this.newPersonForm.get('lastName'); }
  get cf() { return this.newPersonForm.get('cf'); }
  get workRole() { return this.newPersonForm.get('workRole'); }
  get email() { return this.newPersonForm.get('email'); }
  get secondEmail() { return this.newPersonForm.get('secondEmail'); }

  setFormBuilder() : FormGroup {
    if (this.IsSA === true) {
      return this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        cf: ['', Validators.required],
        organizationId: ['', Validators.required],
        workRole: ['', Validators.required],
        phone: ['', Validators.required],
        email: new FormControl('', [Validators.email, Validators.required]),
        secondEmail: new FormControl(null, [Validators.email]),
        isGDPRTermsAccepted: [false],
        isOtherProcessingPurposesAccepted: [true],
        isServiceProcessingPurposesAccepted: [false],
        Role_SA: [false],
        Role_Admin: [false]
      });
    }
    else {
      return this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        cf: ['', Validators.required],
        organizationId: [''],
        workRole: ['', Validators.required],
        phone: ['', Validators.required],
        email: new FormControl('', [Validators.email, Validators.required]),
        secondEmail: new FormControl(null, [Validators.email]),
        isGDPRTermsAccepted: [false],
        isOtherProcessingPurposesAccepted: [true],
        isServiceProcessingPurposesAccepted: [false],
        Role_SA: [false],
        Role_Admin: [false]
      });
    }
  }

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
  getFirstNameError() {
    // @ts-ignore
    if (this.firstName.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getLastNameError() {
    // @ts-ignore
    if (this.firstName.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getCFError() {
    // @ts-ignore
    if (this.cf.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getWorkroleError() {
    // @ts-ignore
    if (this.workRole.hasError('required')) {
      return 'This field is required.';
    }
  }


  getOrgByLogin(): Observable<string> {

    if (this.IsSA === false) {
      return new Observable<string>((observer) => {
        this.httpApi.getAllPeople().subscribe({
          next: (data: any) => {
            var resultData = data.body;
            const ppDTOList: PersonDTO1[] = resultData;

            const CrmOrg = ppDTOList.find(pp => pp.email === this.auth.getUsernameFromJwt());
            if (CrmOrg) {
              this.organizationId = CrmOrg.organizationId;
              observer.next(CrmOrg.organizationId);
              observer.complete();
            } else {
              observer.next("");
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
          }
        });
      });
    } else {
      return new Observable<string>((observer) => {
        if (this.newPersonForm.valid) {
          this.organizationId = this.newPersonForm.value.organizationId;
          observer.next(this.newPersonForm.value.organizationId);
          observer.complete();
        }
        observer.next("");
        observer.complete();
      });
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
        this.getOrgByLogin().subscribe({
          next: (orgId: string) => {
            if (this.newPersonForm.value.Role_SA == true) {
              this.rolesSelected.push("ROLE_SA")
              this.RoleSa = true;
            }
            if (this.newPersonForm.value.Role_Admin == true) {
              this.rolesSelected.push("ROLE_ADMIN")
              this.RoleAdmin = true
            }
            this.rolesSelected.push("ROLE_USER")

            console.log("test 1")
            const newPerson: PersonDTO2 = {
              firstName: this.newPersonForm.value.firstName,
              lastName: this.newPersonForm.value.lastName,
              cf: this.newPersonForm.value.cf,
              organizationId: this.organizationId,
              workRole: this.newPersonForm.value.workRole,
              phone: this.newPersonForm.value.phone.internationalNumber,
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
                  //console.log(newPerson)
                  window.location.reload();
                }, 1000)
              },
              error: err => {
                this.toastr.error('Something is wrong', 'Error');
                setTimeout(() => { }, 1500)
              }
            });
          }
        })
      }
      else {
        this.toastr.error('The form is wrong', 'Error');
        setTimeout(() => { }, 1500)
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
