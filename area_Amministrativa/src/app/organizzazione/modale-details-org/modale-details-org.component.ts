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
      Id: [this.data.org.id],
      Name: [this.data.org.name],
      VATNumber: [this.data.org.vatNumber],
      StreetAddress: [this.data.org.streetAddress],
      City: [this.data.org.city],
      Province_State: [this.data.org.additionalInformation],
      Country: [this.data.org.country],
      ZipCode: [this.data.org.zipCode],
      AdditionalInformation: [this.data.org.additionalInformation],
      WebSite: [this.data.org.webSite],
      EmailAddress: [this.data.org.emailAddress],
      EmailDomain: [this.data.org.emailDomain],
      PEC: [this.data.org.pec],
      BillingCode: [this.data.org.billingCode],
      IsSupplier: [this.data.org.isSupplier],
      IsCustomer: [this.data.org.isCustomer]
    });
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
