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
      id: [this.data.org.id],
      name: [this.data.org.name],
      vat: [this.data.org.vatNumber],
      streetAddress: [this.data.org.streetAddress],
      city: [this.data.org.city],
      province_State: [this.data.org.province_State],
      country: [this.data.org.country],
      zipCode: [this.data.org.zipCode],
      additionalInformation: [this.data.org.additionalInformation],
      webSite: [this.data.org.webSite],
      emailAddress: [this.data.org.emailAddress],
      emailDomain: [this.data.org.emailDomain],
      pec: [this.data.org.pec],
      billingCode: [this.data.org.billingCode],
      isSupplier: [this.data.org.isSupplier],
      isCustomer: [this.data.org.isCustomer]
    });
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
