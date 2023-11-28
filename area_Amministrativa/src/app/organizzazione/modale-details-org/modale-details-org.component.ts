import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { OrganizationDTO} from "../organizzazione.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpProviderService } from "../../service/http-provider.service";

@Component({
  selector: 'app-modale-details-org',
  templateUrl: './modale-details-org.component.html',
  styleUrls: ['./modale-details-org.component.css']
})
export class ModaleDetailsOrgComponent {
  updateOrgForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<ModaleDetailsOrgComponent>,
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

  closepopup(): void {
    this.dialogRef.close();
  }
}
