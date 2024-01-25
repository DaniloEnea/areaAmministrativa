import { Component, OnInit, ViewChild } from '@angular/core';
import { ModaleUpdateOrgComponent } from "./modale-update-org/modale-update-org.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { HttpProviderService } from "../service/http-provider.service";
import { ModaleDetailsOrgComponent } from './modale-details-org/modale-details-org.component';
import { MatInput } from '@angular/material/input';
import { AuthService } from "../service/auth.service";
import { ToastrService } from "ngx-toastr";
import { PersonDTO1 } from '../persone/persone.component';

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
  PeopleList: PersonDTO1[] = [];
  rolefilter: string = '';
  usernamefilter: string = '';
  IsSA: boolean = true;

  // modal
  constructor(public auth: AuthService, private dialog: MatDialog, private httpApi: HttpProviderService, private toastr: ToastrService) {
    this.dataSource = new MatTableDataSource<OrganizationDTO>(this.OrgList);
  }

  ngOnInit() {
    this.allOrg();
  }

  ngAfterViewInit() {
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  checkIsSA(): boolean {
    this.rolefilter = this.auth.getRoleFromJwt();

    if (!this.rolefilter.includes('ROLE_SA')) {
      return this.IsSA = false;
    }
    else {
      return this.IsSA = true;
    }
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
            this.httpApi.getAllPeople().subscribe({
              next: (data: any) => {

                if (data != null && data.body != null) {
                  var retrieveData = data.body;

                  if (retrieveData) {
                    this.OrgList = resultData;
                    this.getOrgIfCrmMgr(resultData, retrieveData);
                    this.dataSource.data = [...this.OrgList];
                  }
                }
              },
              error: (error: any) => {
                console.error("Error fetching user data", error);
              }
            })
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

  getOrgIfCrmMgr(resultData: any, retrieveData: any) {
    this.usernamefilter = this.auth.getUsernameFromJwt();

    if (this.checkIsSA() === false) {

      const ppDTOList: PersonDTO1[] = retrieveData;
      const orgDTOList: OrganizationDTO[] = resultData;

      const CrmOrg = ppDTOList.find(pp => pp.email === this.usernamefilter);
      console.log(CrmOrg)

      if (CrmOrg != null) {
        this.OrgList = orgDTOList.filter(og => og.id == CrmOrg.organizationId);
        this.OrgList = this.OrgList;
        
      }
      else {
        this.toastr.error("No org data found", 'Error');
        this.OrgList = [];
      }
    }
  }

  

  openUpdateDialog(org: OrganizationDTO): void {
    if (this.auth.isAuthenticated()) {
      const dialogRef = this.dialog.open(ModaleUpdateOrgComponent, {
        width: '60%',

        data: { org: org }
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
    else {
      this.toastr.error("Token is expired", "Error")
      setTimeout(() => {
        window.location.reload();
      }, 500)

    }
  }

  openDetailsDialog(org: OrganizationDTO): void {
    if (this.auth.isAuthenticated()) {
      const dialogRef = this.dialog.open(ModaleDetailsOrgComponent, {
        width: '60%',

        data: { org: org }
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
    else {
      this.toastr.error("Token is expired", "Error")
      setTimeout(() => {
        window.location.reload();
      }, 500)

    }
  }
}
