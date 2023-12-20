import { Component, OnInit, ViewChild } from '@angular/core';
import { ModaleUpdateOrgComponent } from "./modale-update-org/modale-update-org.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { HttpProviderService } from "../service/http-provider.service";
import { ModaleDetailsOrgComponent } from './modale-details-org/modale-details-org.component';
import { MatInput } from '@angular/material/input';

export interface OrganizationDTO {
  id: string;
  name: string;
  vatNumber: string;
  streetAddress: string;
  city: string;
  province_State: string;
  country: string;
  zipCode: string;
  additionalInformation: string;
  webSite: string;
  emailAddress: string;
  emailDomain: string;
  pec: string;
  billingCode: string;
  isSupplier: boolean;
  isCustomer: boolean;
  IsValid: boolean;
  IsDeleted: boolean;
}
export interface OrganizationDTO1 {
  name: string;
  vatNumber: string;
  streetAddress: string;
  city: string;
  province_State: string;
  country: string;
  zipCode: string;
  additionalInformation: string;
  webSite: string;
  emailAddress: string;
  emailDomain: string;
  pec: string;
  billingCode: string;
  isSupplier: boolean;
  isCustomer: boolean;
  IsValid: boolean;
  IsDeleted: boolean;
}

@Component({
  selector: 'app-organizzazione',
  templateUrl: './organizzazione.component.html',
  styleUrls: ['./organizzazione.component.css'],
})


export class OrganizzazioneComponent {
  @ViewChild('filterName') filterNameInput!: MatInput;

  filterName = '';
  OrgList: OrganizationDTO[] = [];
  displayedColumns: string[] = ['name', 'streetAddress', 'country', 'emailAddress', 'emailDomain', 'update'];
  dataSource = new MatTableDataSource<OrganizationDTO>(this.OrgList);

  // modal
  constructor(private dialog: MatDialog, private httpApi: HttpProviderService) {
    this.dataSource = new MatTableDataSource<OrganizationDTO>(this.OrgList);
  }

  ngOnInit() {
    this.allOrg();
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  customFilterPredicate() {
    return (data: OrganizationDTO, filter: string): boolean => {
      const searchText = JSON.parse(filter);
      return (
        data.name.toLowerCase().includes(searchText.name)
      );
    };
  }

  applyFilter() {
    const filterValue = { name: this.filterName.toLowerCase() };
    this.dataSource.filter = JSON.stringify(filterValue);
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
