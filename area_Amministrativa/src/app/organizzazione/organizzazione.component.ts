import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ModaleUpdateOrgComponent } from "./modale-update-org/modale-update-org.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { HttpProviderService } from "../service/http-provider.service";
import { ModaleDetailsOrgComponent } from './modale-details-org/modale-details-org.component';
import { MatInput } from '@angular/material/input';
import { AuthService } from "../service/auth.service";
import { ToastrService } from "ngx-toastr";
import { PersonDTO1 } from '../persone/persone.component';
import { Router } from '@angular/router';
import { from } from 'rxjs';

export interface OrganizationDTO {
  Id: string;
  Name: string;
  VATNumber: string;
  StreetAddress: string;
  City: string;
  Province_State: string;
  Country: string;
  ZipCode: string;
  AdditionalInformation: string;
  WebSite: string;
  EmailAddress: string;
  EmailDomain: string;
  PEC: string;
  BillingCode: string;
  IsSupplier: boolean;
  IsCustomer: boolean;
  IsValid: boolean;
  IsDeleted: boolean;
}
export interface OrganizationDTO1 {
  Name: string;
  VatNumber: string;
  StreetAddress: string;
  City: string;
  Province_State: string;
  Country: string;
  ZipCode: string;
  AdditionalInformation: string;
  WebSite: string;
  EmailAddress: string;
  EmailDomain: string;
  PEC: string;
  BillingCode: string;
  IsSupplier: boolean;
  IsCustomer: boolean;
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
  dataSource = new MatTableDataSource<OrganizationDTO>;
  PeopleList: PersonDTO1[] = [];
  rolefilter: string = '';
  usernamefilter: string = '';
  resultData: any;
  IsSA: boolean = true;
  LoadedData: boolean = false;
  progressLoading: number = 0;
  areFiltersVisible: boolean = false;

  // modal
  constructor(private changeDetectorRef: ChangeDetectorRef, public auth: AuthService, private router: Router, private dialog: MatDialog, private httpApi: HttpProviderService, private toastr: ToastrService) {
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
        data.Name.toLowerCase().startsWith(searchText.name)
      );
    };
  }

  toggleFilters() {
    this.areFiltersVisible = !this.areFiltersVisible;
  }

  applyFilter() {
    const filterValue = { name: this.filterName.toLowerCase() };
    this.dataSource.filter = JSON.stringify(filterValue);
  }

  allOrg() {

    this.progressLoading = 50;
  
    try {
      (this.httpApi.getAllOrg()).subscribe({
        next: (data: any) => {
          if (data != null && data.body != null) {
            this.resultData = data.body;

              this.progressLoading = 99;

            if (this.resultData) {
              (this.httpApi.getAllPeople()).subscribe({
                next: (data2: any) => {
                  if (data2 != null && data2.body != null) {
                    const retrieveData = data2.body;
                    if (retrieveData) {
                      this.OrgList = this.resultData;
                      this.getOrgIfCrmMgr(this.resultData, retrieveData);
                      this.LoadedData = true;
                      this.dataSource.data = [...this.OrgList];
                      this.changeDetectorRef.detectChanges();
                    }
                  }
                },
                error: (error: any) => {
                  console.error("Error fetching org data", error);
                }
              });
            }
          }
          else {
            this.LoadedData = true;
            this.toastr.warning("No org data found", "Warn");
          }
        },
        error: (error: any) => {
          if (error.status === 404) {
            if (error.error && error.error.message) {
              this.OrgList = [];
              this.dataSource.data = [...this.OrgList];
            }
          } else {
            console.error("Error fetching org data", error);
          }
        }
      });
    } catch (error) {
      console.error("Error fetching org data", error);
    }

  }

  getOrgIfCrmMgr(resultData: any, retrieveData: any) {
    this.usernamefilter = this.auth.getUsernameFromJwt();

    console.log(this.usernamefilter)
    if (this.auth.checkIsSA() === false) {
      this.IsSA = false;
      const ppDTOList: PersonDTO1[] = retrieveData;
      const orgDTOList: OrganizationDTO[] = resultData;

      const CrmOrg = ppDTOList.find(pp => pp.Email === this.usernamefilter);
      console.log(CrmOrg)

      if (CrmOrg != null) {
        this.OrgList = orgDTOList.filter(og => og.Id == CrmOrg.OrganizationId);
        this.OrgList = this.OrgList;
        
      }
      else {
        this.toastr.error("No org data found", 'Error');
        this.OrgList = [];
      }
    }
  }

  openGoTo(orgId: string): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/persone'], { queryParams: { orgId: orgId } });
    }
    else {
      this.toastr.error("Token is expired", "Error")
      setTimeout(() => {
        window.location.reload();
      }, 500)

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
