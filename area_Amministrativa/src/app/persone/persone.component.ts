import {Component, OnInit, ViewChild} from '@angular/core';
import {ModaleDeleteComponent} from "../modale-delete/modale-delete.component";
import {ModaleUpdatePersoneComponent} from "./modale-update-persone/modale-update-persone.component";
import {ModaleAddPersoneComponent} from "./modale-add-persone/modale-add-persone.component";
import {MatDialog} from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import {HttpProviderService} from "../service/http-provider.service";
import { ModaleDetailsPersoneComponent } from './modale-details-persone/modale-details-persone.component';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatInput} from "@angular/material/input";
import { FormBuilder } from '@angular/forms';
import { AuthService } from "../service/auth.service";
import { ToastrService } from "ngx-toastr";
import { OrganizationDTO } from '../organizzazione/organizzazione.component';
import {Router} from "@angular/router";

/*export interface FilterDTO {
  first_name: string;
  last_name: string;
}*/

export interface UserDTO {
  personId: string;
  username: string;
  roles: any[];
}


export interface PersonDTO {
  id: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  workRole: string;
  phone: string;
  email: string;
  secondEmail: string;
  cf: string;
  isGDPRTermsAccepted: boolean;
  isServiceProcessingPurposesAccepted: boolean;
  isOtherProcessingPurposesAccepted: boolean;
  IsValid: boolean;
  IsDeleted: boolean;
}
export interface PersonDTO1 {
  id: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  organizationName: string;
  workRole: string;
  phone: string;
  email: string;
  secondEmail: string;
  cf: string;
  isGDPRTermsAccepted: boolean;
  isServiceProcessingPurposesAccepted: boolean;
  isOtherProcessingPurposesAccepted: boolean;
  roles: string[];
}

export interface PersonDTO2 {
  firstName: string;
  lastName: string;
  workRole: string;
  phone: string;
  email: string;
  secondEmail: string;
  cf: string;
  isGDPRTermsAccepted: boolean;
  isServiceProcessingPurposesAccepted: boolean;
  isOtherProcessingPurposesAccepted: boolean;
  roles: string[];
}

@Component({
  selector: 'app-persone',
  templateUrl: './persone.component.html',
  styleUrls: ['./persone.component.css']
})

export class PersoneComponent implements OnInit{
  @ViewChild('filterFirstName') filterFirstNameInput: MatInput | undefined; // Riferimento all'input di firstName
  @ViewChild('filterLastName') filterLastNameInput: MatInput | undefined; // Riferimento all'input di lastName
  @ViewChild('filterOrg') filterOrgInput: MatInput | undefined; // Riferimento all'input di lastName

  filterFirstName = ''; // Aggiungi questa linea per il valore del filtro per firstName
  filterLastName = ''; // Aggiungi questa linea per il valore del filtro per lastName
  filterOrg = '';
  resetButtonDisabled = false;
  IsSA = true;
  buttonColor = 'primary';
  adminOrgFilter = '';



  //filterForm: FormGroup
  classForm: string = "People";
  PeopleList: PersonDTO1[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'phone', 'email', 'roles', 'update'];
  dataSource = new MatTableDataSource<PersonDTO1>;

  constructor(public auth: AuthService, private dialog: MatDialog, private formBuilder: FormBuilder, private httpApi: HttpProviderService, private toastr: ToastrService) {
    this.dataSource = new MatTableDataSource<PersonDTO1>(this.PeopleList);
    /*this.filterForm = this.formBuilder.group({
      first_name: [null],
      last_name: [null]
    });*/
  }

  ngOnInit() {
    this.allPeople();
  }

  /*applyFilter() {
    console.log(this.filterForm.value.first_name)
    if (this.filterForm.valid) {

      this.httpApi.filterPeople(this.filterForm.value.first_name, this.filterForm.value.last_name).subscribe({
        next: value=> {
          this.dataSource = new MatTableDataSource<PersonDTO>(value.body);
        },
        error: err => {
          console.log("error")
        }
      })
    }
  }*/

  ngAfterViewInit() {
    // Imposta la funzione di filtro personalizzata per il dataSource
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  customFilterPredicate() {
    return (data: PersonDTO1, filter: string): boolean => {
      const searchText = JSON.parse(filter);

      return (
        data.firstName.toLowerCase().includes(searchText.firstName) &&
        data.lastName.toLowerCase().includes(searchText.lastName) &&
        data.organizationName.toLowerCase().includes(searchText.organizationName)

      );
    };
  }

  usernamefilter: string = '';
  rolefilter: string = '';

  checkIsSA(): boolean {
    this.rolefilter = this.auth.getRoleFromJwt();

    if (!this.rolefilter.includes('ROLE_SA')) {
      return this.IsSA = false;
    }
    else {
      return this.IsSA = true;
    }
  }      
        

  applyFilter() {
    // Applica il filtro in base alle proprietà firstName e lastName
    const filterValue = { firstName: this.filterFirstName.toLowerCase(), lastName: this.filterLastName.toLowerCase(), organizationName: this.filterOrg.toLowerCase() };
    this.dataSource.filter = JSON.stringify(filterValue);
  }
  allPeople() {
    this.usernamefilter = this.auth.getUsernameFromJwt();

    this.httpApi.getAllPeople().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            this.PeopleList = resultData;

            this.getPeopleIfAdmin(this.PeopleList)


            this.httpApi.getAllUsers().subscribe({
              next: (userData: any) => {
                if (userData != null && userData.body != null) {
                  const userDTOList: UserDTO[] = userData.body;



                  this.PeopleList.forEach((person: PersonDTO1) => {
                    this.httpApi.getAllOrg().subscribe(
                      {
                        next: (orgData: any) => {
                          if (orgData != null && orgData.body != null) {
                            const orgDTOList: OrganizationDTO[] = orgData.body;

                            const associatedUser = userDTOList.find(user => user.username === person.email);
                            const associatedOrg = orgDTOList.find(org => org.id === person.organizationId);

                            if (associatedUser && associatedOrg) {
                              person.roles = associatedUser.roles.map(role => role.role);

                              person.organizationName = associatedOrg.name;
                            }
                            if (!associatedUser) {
                              person.roles = ['Null'];
                            }
                            if (!associatedOrg) {
                              person.organizationName = 'No org';
                            }
                          }
                        },
                        error: (error: any) => {
                          console.error("Error fetching org data", error);
                        }
                      }
                    );
                  });

                  this.dataSource.data = [...this.PeopleList];
                  console.log(this.PeopleList);
                }
              },
              error: (error: any) => {
                console.error("Error fetching user data", error);
              }
            });

          }
        }
      },
      error: (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.PeopleList = [];
              this.dataSource.data = [...this.PeopleList];
            }
          }
        }
      }
    });
  }

  getPeopleIfAdmin(resultData: any) {
    if (this.checkIsSA() === false) {
      const ppDTOList: PersonDTO1[] = resultData;

      const CrmOrg = ppDTOList.find(pp => pp.email === this.usernamefilter);
      if (CrmOrg) {
        this.PeopleList = this.PeopleList.filter(orgs => orgs.organizationId === CrmOrg.organizationId);
      }
      else {
        this.toastr.error("No org data found", 'Error');
        this.PeopleList = [];
      }
    }
  }

  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(ModaleDeleteComponent, {
      data: { Id: id, ClassForm: this.classForm } // passo l'ID
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }


  openAddDialog(): void {
    if (this.auth.isAuthenticated()) {
      const dialogRef = this.dialog.open(ModaleAddPersoneComponent, {
        width: '60%',
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


  openUpdateDialog(person: PersonDTO1): void {
    if (this.auth.isAuthenticated()) {
      const dialogRef = this.dialog.open(ModaleUpdatePersoneComponent, {
        width: '60%',

        data: { person: person }
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

  openDetailsDialog(person: PersonDTO1): void {
    if (this.auth.isAuthenticated()) {
      const dialogRef = this.dialog.open(ModaleDetailsPersoneComponent, {
        width: '60%',

        data: { person: person }
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

resetPassword(email: string): void {
  // Verifica se l'utente è già autenticato
  if (this.auth.isAuthenticated()) {
    // Disabilita il pulsante
    this.resetButtonDisabled = true;
    // Mette il colore grigio
    this.buttonColor = 'grey';

    // Chiamata alla funzione di reset della password
    this.httpApi.forgotPwdByEmail(email, null).subscribe(
      {
        next: value => {
          this.toastr.success("We have sent a reset password link to your email. Please check.", "Success")
        },
        error: err => {
          this.toastr.error("Something is error",  "Error")
        },
        complete: () => {
          setTimeout(() => {
            this.resetButtonDisabled = false;
            this.buttonColor = 'primary';
            window.location.reload();
          }, 60000);
        }
      }
    );
  } else {
    this.toastr.error("Token is expired", "Error")
      setTimeout(() => {
        window.location.reload();
      }, 500)
  }
}


}
