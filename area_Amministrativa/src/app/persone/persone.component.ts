import {Component, ViewChild} from '@angular/core';
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

export class PersoneComponent {
  @ViewChild('filterFirstName') filterFirstNameInput: MatInput | undefined; // Riferimento all'input di firstName
  @ViewChild('filterLastName') filterLastNameInput: MatInput | undefined; // Riferimento all'input di lastName
  @ViewChild('filterOrg') filterOrgInput: MatInput | undefined; // Riferimento all'input di lastName

  filterFirstName = ''; // Aggiungi questa linea per il valore del filtro per firstName
  filterLastName = ''; // Aggiungi questa linea per il valore del filtro per lastName
  filterOrg = '';

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

  applyFilter() {
    // Applica il filtro in base alle proprietà firstName e lastName
    const filterValue = { firstName: this.filterFirstName.toLowerCase(), lastName: this.filterLastName.toLowerCase(), organizationName: this.filterOrg.toLowerCase() };
    this.dataSource.filter = JSON.stringify(filterValue);
  }
  allPeople() {
    this.httpApi.getAllPeople().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            this.PeopleList = resultData;

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
                              person.roles = ["Null"];
                            }
                            if (!associatedOrg) {
                              person.organizationName = "No org";
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
    // check if user is already authenticated
    if (this.auth.isAuthenticated()) {
        this.httpApi.forgotPwdByEmail(email, null).subscribe(
          {
            next: value => {
              this.toastr.success("We have sent a reset password link to your email. Please check.", "Success")
            },
            error: err => {
              this.toastr.error("Something is error",  "Error")
            }
          }
        )
    }
  }

}
