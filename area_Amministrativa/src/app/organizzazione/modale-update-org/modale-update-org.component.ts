import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OrganizationDTO, OrganizationDTO1 } from "../organizzazione.component";
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

  constructor(public auth: AuthService,public dialogRef: MatDialogRef<ModaleUpdateOrgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { org: OrganizationDTO },
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService, private toastr: ToastrService) {


    this.updateOrgForm = this.formBuilder.group({
      name: [this.data.org.name, Validators.required],
      vatNumber: [this.data.org.vatNumber, Validators.required],
      streetAddress: [this.data.org.streetAddress, Validators.required],
      city: [this.data.org.city, Validators.required],
      province_State: [this.data.org.province_State, Validators.required],
      country: [this.data.org.country, Validators.required],
      zipCode: [this.data.org.zipCode, Validators.required],
      additionalInformation: [this.data.org.additionalInformation],
      webSite: [this.data.org.webSite, Validators.required],
      emailAddress: new FormControl(this.data.org.emailAddress, [Validators.email, Validators.required]),
      emailDomain: [this.data.org.emailDomain, Validators.required],
      pec: new FormControl(this.data.org.pec, [Validators.email, Validators.required]),
      billingCode: [this.data.org.billingCode, Validators.required],
      isSupplier: [this.data.org.isSupplier, Validators.required],
      isCustomer: [this.data.org.isCustomer, Validators.required],
      IsValid: [true],
      IsDeleted: [false]
    });
  }

  get name() { return this.updateOrgForm.get('name'); }
  get vatNumber() { return this.updateOrgForm.get('vatNumber'); }
  get streetAddress() { return this.updateOrgForm.get('streetAddress'); }
  get city() { return this.updateOrgForm.get('city'); }
  get province_State() { return this.updateOrgForm.get('province_State'); }
  get country() { return this.updateOrgForm.get('country'); }
  get zipCode() { return this.updateOrgForm.get('zipCode'); }
  get webSite() { return this.updateOrgForm.get('webSite'); }
  get emailAddress() { return this.updateOrgForm.get('emailAddress'); }
  get emailDomain() { return this.updateOrgForm.get('emailDomain'); }
  get pec() { return this.updateOrgForm.get('pec'); }
  get billingCode() { return this.updateOrgForm.get('billingCode'); }

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


  onUpdateClick(): void {
    if (this.auth.isAuthenticated()) {
      if (this.updateOrgForm.valid) {
        console.log(this.data.org.id)
        const updateOrg: OrganizationDTO = {
          id: this.data.org.id,
          name: this.updateOrgForm.value.name,
          vatNumber: this.updateOrgForm.value.vatNumber,
          streetAddress: this.updateOrgForm.value.streetAddress,
          city: this.updateOrgForm.value.city,
          province_State: this.updateOrgForm.value.province_State,
          country: this.updateOrgForm.value.country,
          zipCode: this.updateOrgForm.value.zipCode,
          additionalInformation: this.updateOrgForm.value.additionalInformation,
          webSite: this.updateOrgForm.value.webSite,
          emailAddress: this.updateOrgForm.value.emailAddress,
          emailDomain: this.updateOrgForm.value.emailDomain,
          pec: this.updateOrgForm.value.pec,
          billingCode: this.updateOrgForm.value.billingCode,
          isSupplier: this.updateOrgForm.value.isSupplier,
          isCustomer: this.updateOrgForm.value.isCustomer,
          IsValid: this.updateOrgForm.value.isValid,
          IsDeleted: this.updateOrgForm.value.isDeleted
        };



        // post for create new user
        this.httpApi.updateOrg(this.data.org.id, updateOrg).subscribe((response) => {
          this.toastr.success("Data updated successfully", "Success");
          setTimeout(() => {
            window.location.reload();
          }, 1500)
        },
          (error) => {
            this.toastr.error('Something is wrong', 'Error');
            setTimeout(() => { }, 1500)
          });
        this.dialogRef.close(updateOrg);
      }
    }
    else {
      this.toastr.error("Token is expired", "Error")
      setTimeout(() => {
        window.location.reload();
      }, 500)

    }
  }
  closepopup() {
    this.dialogRef.close();
  }
}
