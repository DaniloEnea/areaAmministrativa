import { Component } from '@angular/core';
import { ModaleUpdateOrgComponent } from "./modale-update-org/modale-update-org.component";
import { MatDialog } from "@angular/material/dialog";
import * as jsonData from '../organization.json'
import { MatTableDataSource } from "@angular/material/table";

export interface OrganizationDTO {
  name: string;
  VAT: string;
  street_address: string;
  city: string;
  province_state: string;
  country: string;
  zip_code: string;
  additional_info: string;
  website: string;
  email: string;
  domain: string;
  PEC: string;
}

@Component({
  selector: 'app-organizzazione',
  templateUrl: './organizzazione.component.html',
  styleUrls: ['./organizzazione.component.css'],
})


export class OrganizzazioneComponent {
  displayedColumns: string[] = ['name', 'street_address', 'country', 'email', 'domain', 'update'];
  dataSource = new MatTableDataSource<OrganizationDTO>(jsonData);
  protected readonly alert = alert;

  // modal
 constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ModaleUpdateOrgComponent,{
      width:'60%',   // Set width to 60%  of the window's total width
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
