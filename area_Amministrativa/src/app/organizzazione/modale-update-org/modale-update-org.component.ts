import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OrganizationDTO, OrganizationDTO1 } from "../organizzazione.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";

@Component({
  selector: 'app-modale-update',
  templateUrl: './modale-update-org.component.html',
  styleUrls: ['./modale-update-org.component.css']
})
export class ModaleUpdateOrgComponent {

  updateOrgForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<ModaleUpdateOrgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { org: OrganizationDTO },
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService) {

    this.updateOrgForm = this.formBuilder.group({
      name: [this.data.org.name, Validators.required],
      vatNumber: [this.data.org.vatNumber, Validators.required],
      streetAddress: [this.data.org.streetAddress, Validators.required],
      city: [this.data.org.city, Validators.required],
      province_State: [this.data.org.province_State, Validators.required],
      country: [this.data.org.country, Validators.required],
      zipCode: [this.data.org.zipCode, Validators.required],
      additionalInformation: [this.data.org.additionalInformation, Validators.required],
      webSite: [this.data.org.webSite, Validators.required],
      emailAddress: [this.data.org.emailAddress, Validators.required],
      emailDomain: [this.data.org.emailDomain, Validators.required],
      pec: [this.data.org.pec, Validators.required],
      billingCode: [this.data.org.billingCode, Validators.required],
      isSupplier: [this.data.org.isSupplier, Validators.required],
      isCustomer: [this.data.org.isCustomer, Validators.required],
      IsValid: [true],
      IsDeleted: [false]
    });
  }

  onUpdateClick(): void {
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
      this.httpApi.updateOrg(this.data.org.id, updateOrg).subscribe();
      this.dialogRef.close(updateOrg);
      window.location.reload();
    }
  }
  closepopup() {
    this.dialogRef.close();
  }
}
