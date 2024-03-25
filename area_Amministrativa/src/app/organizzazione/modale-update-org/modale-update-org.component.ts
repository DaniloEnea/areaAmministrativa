import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OrganizationDTO } from "../organizzazione.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../service/auth.service";

@Component({
  selector: 'app-modale-update',
  templateUrl: './modale-update-org.component.html',
  styleUrls: ['./modale-update-org.component.css']
})
export class ModaleUpdateOrgComponent {

  updateOrgForm: FormGroup;

  constructor(public auth: AuthService, public dialogRef: MatDialogRef<ModaleUpdateOrgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { org: OrganizationDTO },
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService, private toastr: ToastrService) {


    this.updateOrgForm = this.formBuilder.group({
      Name: [this.data.org.name, Validators.required],
      VATNumber: [this.data.org.vatNumber, Validators.required],
      StreetAddress: [this.data.org.streetAddress, Validators.required],
      City: [this.data.org.city, Validators.required],
      Province_State: [this.data.org.province_State, Validators.required],
      Country: [this.data.org.country, Validators.required],
      ZipCode: [this.data.org.zipCode, Validators.required],
      AdditionalInformation: [this.data.org.additionalInformation],
      WebSite: [this.data.org.webSite, Validators.required],
      EmailAddress: new FormControl(this.data.org.emailAddress, [Validators.email, Validators.required]),
      EmailDomain: [this.data.org.emailDomain, Validators.required],
      PEC: new FormControl(this.data.org.pec, [Validators.email, Validators.required]),
      BillingCode: [this.data.org.billingCode, Validators.required],
      IsSupplier: [this.data.org.isSupplier, Validators.required],
      IsCustomer: [this.data.org.isCustomer, Validators.required],
      IsValid: [true],
      IsDeleted: [false]
    });
  }

  get name() { return this.updateOrgForm.get('Name'); }
  get vatNumber() { return this.updateOrgForm.get('VATNumber'); }
  get streetAddress() { return this.updateOrgForm.get('StreetAddress'); }
  get city() { return this.updateOrgForm.get('City'); }
  get province_State() { return this.updateOrgForm.get('Province_State'); }
  get country() { return this.updateOrgForm.get('Country'); }
  get zipCode() { return this.updateOrgForm.get('ZipCode'); }
  get webSite() { return this.updateOrgForm.get('WebSite'); }
  get emailAddress() { return this.updateOrgForm.get('EmailAddress'); }
  get emailDomain() { return this.updateOrgForm.get('EmailDomain'); }
  get pec() { return this.updateOrgForm.get('PEC'); }
  get billingCode() { return this.updateOrgForm.get('BillingCode'); }

  // @ts-ignore
  getEmailAddressError() {
    // @ts-ignore
    if (this.emailAddress.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    // @ts-ignore
    if (this.emailAddress.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getPecError() {
    // @ts-ignore
    if (this.pec.hasError('email')) {
      return 'Please enter a valid PEC.';
    }
    // @ts-ignore
    if (this.pec.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getNameError() {
    // @ts-ignore
    if (this.name.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getVatNumberError() {
    // @ts-ignore
    if (this.vatNumber.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getStreetAddressError() {
    // @ts-ignore
    if (this.streetAddress.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getCityError() {
    // @ts-ignore
    if (this.city.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getProvinceStateError() {
    // @ts-ignore
    if (this.province_State.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getCountryError() {
    // @ts-ignore
    if (this.country.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getZipCodeError() {
    // @ts-ignore
    if (this.zipCode.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getWebSiteError() {
    // @ts-ignore
    if (this.webSite.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getEmailDomainError() {
    // @ts-ignore
    if (this.emailDomain.hasError('required')) {
      return 'This field is required.';
    }
  }

  // @ts-ignore
  getBillingCodeError() {
    // @ts-ignore
    if (this.billingCode.hasError('required')) {
      return 'This field is required.';
    }
  }


  onUpdateClick(){
    this.auth.testIsAuthenticated((authenticated: boolean) => {
      if (authenticated) {
        if (this.updateOrgForm.valid) {
          console.log(this.data.org.id)
          const updateOrg: OrganizationDTO = {
            id: this.data.org.id,
            name: this.updateOrgForm.value.Name,
            vatNumber: this.updateOrgForm.value.VATNumber,
            streetAddress: this.updateOrgForm.value.StreetAddress,
            city: this.updateOrgForm.value.City,
            province_State: this.updateOrgForm.value.Province_State,
            country: this.updateOrgForm.value.Country,
            zipCode: this.updateOrgForm.value.ZipCode,
            additionalInformation: this.updateOrgForm.value.AdditionalInformation,
            webSite: this.updateOrgForm.value.WebSite,
            emailAddress: this.updateOrgForm.value.EmailAddress,
            emailDomain: this.updateOrgForm.value.EmailDomain,
            pec: this.updateOrgForm.value.PEC,
            billingCode: this.updateOrgForm.value.BillingCode,
            isSupplier: this.updateOrgForm.value.IsSupplier,
            isCustomer: this.updateOrgForm.value.IsCustomer,
            isValid: this.updateOrgForm.value.IsValid,
            isDeleted: this.updateOrgForm.value.IsDeleted
          };


          console.log(updateOrg);
          // post for create new user
          this.httpApi.updateOrg(this.data.org.id, updateOrg).subscribe({
            next: (response: any) => {
              this.toastr.success("Data updated successfully", "Success");
              setTimeout(() => {
                window.location.reload();
              }, 1500)
            },
            error: (err: any) => {
              console.log(err);
              this.toastr.error('Something is wrong', 'Error');
              setTimeout(() => { }, 1500)
            }
          })
        this.dialogRef.close(updateOrg);
        }
      } else {
        this.toastr.error("Token is expired", "Error")
        setTimeout(() => {
          window.location.reload();
        }, 500)
      }
    });    

  }

  closepopup() {
    this.dialogRef.close();
  }
}
