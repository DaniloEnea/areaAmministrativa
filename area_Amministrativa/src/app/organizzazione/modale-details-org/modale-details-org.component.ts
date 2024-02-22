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
      Id: [this.data.org.Id],
      Name: [this.data.org.Name],
      VATNumber: [this.data.org.VATNumber],
      StreetAddress: [this.data.org.StreetAddress],
      City: [this.data.org.City],
      Province_State: [this.data.org.Province_State],
      Country: [this.data.org.Country],
      ZipCode: [this.data.org.ZipCode],
      AdditionalInformation: [this.data.org.AdditionalInformation],
      WebSite: [this.data.org.WebSite],
      EmailAddress: [this.data.org.EmailAddress],
      EmailDomain: [this.data.org.EmailDomain],
      PEC: [this.data.org.PEC],
      BillingCode: [this.data.org.BillingCode],
      IsSupplier: [this.data.org.IsSupplier],
      IsCustomer: [this.data.org.IsCustomer]
    });
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
