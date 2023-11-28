import { Component, OnInit } from '@angular/core';
import { ModaleUpdateOrgComponent } from "./modale-update-org/modale-update-org.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { HttpProviderService } from "../service/http-provider.service";
import { ModaleDetailsOrgComponent } from './modale-details-org/modale-details-org.component';

export interface OrganizationDTO {
  id: number;
  name: string;
  vat: string;
  street_address: string;
  city: string;
  province_state: string;
  country: string;
  zip_code: number;
  additional_info: string;
  website: string;
  email: string;
  domain: string;
  pec: string;
}
export interface OrganizationDTO1 {
  name: string;
  vat: string;
  street_address: string;
  city: string;
  province_state: string;
  country: string;
  zip_code: number;
  additional_info: string;
  website: string;
  email: string;
  domain: string;
  pec: string;
}

@Component({
  selector: 'app-organizzazione',
  templateUrl: './organizzazione.component.html',
  styleUrls: ['./organizzazione.component.css'],
})


export class OrganizzazioneComponent {
  OrgList: OrganizationDTO[] = [];
  displayedColumns: string[] = ['name', 'street_address', 'country', 'email', 'domain', 'update'];
  dataSource = new MatTableDataSource<OrganizationDTO>(this.OrgList);

  // modal
  constructor(private dialog: MatDialog, private httpApi: HttpProviderService) {
    this.dataSource = new MatTableDataSource<OrganizationDTO>(this.OrgList);
  }

  ngOnInit() {
    this.allOrg();
  }

  allOrg() {
    this.httpApi.getAllOrg().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            this.OrgList = resultData;
            this.dataSource.data = [...this.OrgList];
            console.log(this.OrgList);
          }
        }
      },
      error: (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.OrgList = [];
              this.dataSource.data = [...this.OrgList];
            }
          }
        }
      }
    });
  }


  openUpdateDialog(org: OrganizationDTO): void {
    const dialogRef = this.dialog.open(ModaleUpdateOrgComponent, {
      width: '60%',

      data: { org: org }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDetailsDialog(org: OrganizationDTO): void {
    const dialogRef = this.dialog.open(ModaleDetailsOrgComponent, {
      width: '60%',

      data: { org: org }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
