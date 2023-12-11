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
      vat: [this.data.org.vat, Validators.required],
      street_address: [this.data.org.street_address, Validators.required],
      city: [this.data.org.city, Validators.required],
      province_state: [this.data.org.province_state, Validators.required],
      country: [this.data.org.country, Validators.required],
      zip_code: [this.data.org.zip_code, Validators.required],
      additional_info: [this.data.org.additional_info, Validators.required],
      website: [this.data.org.website, Validators.required],
      email: [this.data.org.email, Validators.required],
      domain: [this.data.org.domain, Validators.required],
      pec: [this.data.org.pec],
    });
  }

  onUpdateClick(): void {
    if (this.updateOrgForm.valid) {
      const updateOrg: OrganizationDTO1 = {
        name: this.updateOrgForm.value.name,
        vat: this.updateOrgForm.value.vat,
        street_address: this.updateOrgForm.value.street_address,
        city: this.updateOrgForm.value.city,
        province_state: this.updateOrgForm.value.province_state,
        country: this.updateOrgForm.value.country,
        zip_code: this.updateOrgForm.value.zip_code,
        additional_info: this.updateOrgForm.value.additional_info,
        website: this.updateOrgForm.value.website,
        email: this.updateOrgForm.value.email,
        domain: this.updateOrgForm.value.domain,
        pec: this.updateOrgForm.value.pec,
      };

      // post for create new user
      //this.httpApi.updateOrg(this.data.org.id, updateOrg).subscribe();
      this.dialogRef.close(updateOrg);
      window.location.reload();
    }
  }
  closepopup() {
    this.dialogRef.close();
  }
}
