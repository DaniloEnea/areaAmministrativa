import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PersonDTO, PersonDTO1, PersonDTO2 } from "../persone.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../service/auth.service";
import { Observable, from } from 'rxjs';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { EncryptionService } from '../../service/encryption.service';


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

  constructor(public auth: AuthService, public encryptionService: EncryptionService, public dialogRef: MatDialogRef<ModaleAddPersoneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { person: PersonDTO1, roles: Roles },
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService, private toastr: ToastrService) {

    this.IsSA = auth.checkIsSA();

    if (this.IsSA === true) {
      const orgObservable = from(this.httpApi.getAllOrg())
      orgObservable.subscribe({
        next: (data: any) => {

          const decryptedData = this.httpApi.decrypt(data.body);

          if (decryptedData != null) {
            this.organizations = decryptedData;
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

        const PersonObservable = from(this.httpApi.getAllPeople())
        PersonObservable.subscribe({
          next: (data: any) => {
            var resultData = data.body;
            const ppDTOList: PersonDTO1[] = resultData;

            const CrmOrg = ppDTOList.find(pp => pp.Email === this.auth.getUsernameFromJwt());
            if (CrmOrg) {
              this.organizationId = CrmOrg.OrganizationId;
              observer.next(CrmOrg.OrganizationId);
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
              FirstName: this.newPersonForm.value.firstName,
              LastName: this.newPersonForm.value.lastName,
              CF: this.newPersonForm.value.cf,
              OrganizationId: this.organizationId,
              WorkRole: this.newPersonForm.value.workRole,
              Phone: this.newPersonForm.value.phone.internationalNumber,
              Email: this.newPersonForm.value.email,
              SecondEmail: this.newPersonForm.value.secondEmail,
              IsGDPRTermsAccepted: this.newPersonForm.value.isGDPRTermsAccepted,
              IsOtherProcessingPurposesAccepted: this.newPersonForm.value.isOtherProcessingPurposesAccepted,
              IsServiceProcessingPurposesAccepted: this.newPersonForm.value.isServiceProcessingPurposesAccepted,
              Roles:
                this.rolesSelected

            };

            console.log(newPerson)
            
            // post for create new user 
            const addPersonObservable = from(this.httpApi.addNewPerson(newPerson));
            addPersonObservable.subscribe({
              next: (value: any) => {
                this.httpApi.sendEmailCreation(this.newPersonForm.value.email, null).subscribe(
                  {
                    next: value => {
                      this.toastr.success("The create email has been sent", "Success")
                    },
                    error: err => {
                      this.toastr.warning("Can't inform user about creation", "Warn")
                    },
                  }
                );
                this.toastr.success("Data updated successfully", "Success");
                setTimeout(() => {
                  //console.log(newPerson)
                  window.location.reload();
                }, 1500)
              },
              error: (err: any) => {
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
