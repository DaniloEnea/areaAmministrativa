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
import {ActivatedRoute, Router} from "@angular/router";
import {ModaleCreateUserComponent} from "./modale-create-user/modale-create-user.component";
import { from } from 'rxjs';

/*export interface FilterDTO {
  first_name: string;
  last_name: string;
}*/

export interface UserDTO {
  PersonId: string;
  Username: string;
  Roles: any[];
}

export interface PersonDTO {
  Id: string;
  FirstName: string;
  LastName: string;
  OrganizationId: string;
  WorkRole: string;
  Phone: string;
  Email: string;
  SecondEmail: string;
  CF: string;
  IsGDPRTermsAccepted: boolean;
  IsServiceProcessingPurposesAccepted: boolean;
  IsOtherProcessingPurposesAccepted: boolean;
  IsValid: boolean;
  IsDeleted: boolean;
}
export interface PersonDTO1 {
  Id: string;
  FirstName: string;
  LastName: string;
  OrganizationId: string;
  OrganizationName: string;
  WorkRole: string;
  Phone: string;
  Email: string;
  SecondEmail: string;
  CF: string;
  IsGDPRTermsAccepted: boolean;
  IsServiceProcessingPurposesAccepted: boolean;
  IsOtherProcessingPurposesAccepted: boolean;
  Roles: string[];
}

export interface PersonDTO2 {
  FirstName: string;
  LastName: string;
  WorkRole: string;
  Phone: string;
  Email: string;
  SecondEmail: string;
  CF: string;
  OrganizationId: string;
  IsGDPRTermsAccepted: boolean;
  IsServiceProcessingPurposesAccepted: boolean;
  IsOtherProcessingPurposesAccepted: boolean;
  Roles: string[];
}

export interface User {
  Email: string;
  Password: string;
  Id: string;
  Roles: string[];
}

@Component({
  selector: 'app-persone',
  templateUrl: './persone.component.html',
  styleUrls: ['./persone.component.css']
})

export class PersoneComponent implements OnInit {
  @ViewChild('filterFirstNameInput') filterFirstNameInput!: MatInput; // Riferimento all'input di firstName
  @ViewChild('filterLastNameInput') filterLastNameInput!: MatInput; // Riferimento all'input di lastName
  @ViewChild('filterOrgInput') filterOrgInput!: MatInput; // Riferimento all'input di organization


  filterFirstName = ''; // Aggiungi questa linea per il valore del filtro per firstName
  filterLastName = ''; // Aggiungi questa linea per il valore del filtro per lastName
  filterOrg = '';
  resetButtonDisabled: { [key: string]: boolean } = {};
  hideCreateUser: { [key: string]: boolean } = {};
  IsSA = true;
  buttonColor: { [email: string]: string } = {};
  adminOrgFilter = '';
  LoadedData: boolean = false;



  //filterForm: FormGroup
  classForm: string = "People";
  PeopleList: PersonDTO1[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'phone', 'email', 'roles', 'update'];
  dataSource = new MatTableDataSource<PersonDTO1>;

  constructor(public auth: AuthService, private route: ActivatedRoute, private dialog: MatDialog, private formBuilder: FormBuilder, private httpApi: HttpProviderService, private toastr: ToastrService) {
    this.dataSource = new MatTableDataSource<PersonDTO1>(this.PeopleList);
    /*this.filterForm = this.formBuilder.group({
      first_name: [null],
      last_name: [null]
    });*/
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const orgId = params['orgId'];
      if (orgId) {
        this.allPeople(orgId);
      } else {
        this.allPeople();
      }
    });
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
      data.FirstName.toLowerCase().startsWith(searchText.FirstName) &&
      data.LastName.toLowerCase().startsWith(searchText.LastName) &&
      (!searchText.OrganizationName || data.OrganizationName.toLowerCase().startsWith(searchText.OrganizationName))
    );
  };
}


  usernamefilter: string = '';
  rolefilter: string = '';


  applyFilter() {
    // Applica il filtro in base alle proprietà firstName e lastName
    const filterValue = {
      FirstName: this.filterFirstName.toLowerCase(),
      LastName: this.filterLastName.toLowerCase(),
      OrganizationName: this.filterOrg.toLowerCase()
    };
    this.dataSource.filter = JSON.stringify(filterValue);
  }


  allPeople(orgId?: string) {
    this.usernamefilter = this.auth.getUsernameFromJwt();
    this.httpApi.getAllPeople().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          var decryptedData = this.httpApi.decrypt(data.body)
          console.log(decryptedData);
          var resultData = decryptedData;
          if (resultData) {
            this.PeopleList = resultData;

            this.getPeopleIfAdmin(this.PeopleList)

            if (orgId != null) {
              this.PeopleList = this.PeopleList.filter(orgs => orgs.OrganizationId === orgId);
            }

            this.httpApi.getAllUsers().subscribe({
              next: (userData: any) => {
                if (userData != null && userData.body != null) {
                  const userDTOList: UserDTO[] = userData.body;


                  console.log("testina")
                  console.log(userDTOList)

                  this.PeopleList.forEach((person: PersonDTO1) => {
                    this.httpApi.getAllOrg().subscribe(
                      {
                        next: (orgData: any) => {
                          if (orgData != null && orgData.body != null) {
                            const orgDTOList: OrganizationDTO[] = this.httpApi.decrypt(orgData.body);

                            const associatedOrg = orgDTOList.find(org => org.Id === person.OrganizationId);



                            const associatedUser = userDTOList.find(user => user.Username === person.Email);

                            if (associatedUser && associatedOrg) {
                              this.hideCreateUser[associatedUser.Username] = true;
                              person.Roles = associatedUser.Roles.map(role => role.role);

                              person.OrganizationName = associatedOrg.Name;
                            }
                            if (!associatedUser) {
                              person.Roles = ['Null'];
                            }
                            if (!associatedOrg) {
                              person.OrganizationName = 'No org';
                            }
                          }
                        },
                        error: (error: any) => {
                          console.error("Error fetching org data", error);
                        }
                      }
                    );
                  });
                  this.LoadedData = true;
                  this.dataSource.data = [...this.PeopleList];
                  console.log(this.PeopleList);
                }
              },
              error: (error: any) => {
                this.toastr.error("Error fetching user data", "error")
                console.error("Error fetching user data", error);
              }
            });

          }
        }
        else {
          this.LoadedData = true;
          this.toastr.warning("No people data found", "Warn");
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
    if (this.auth.checkIsSA() === false) {
      this.IsSA = false;
      const ppDTOList: PersonDTO1[] = resultData;

      const CrmOrg = ppDTOList.find(pp => pp.Email === this.usernamefilter);

      if (CrmOrg) {
        this.PeopleList = this.PeopleList.filter(orgs => orgs.OrganizationId === CrmOrg.OrganizationId);
      }
      else {
        this.toastr.error("No org data found", 'Error');
        this.PeopleList = [];
      }
    }
    else {
      this.IsSA = true;
    }
  }

  async disableUser(username: string) {
    const usernameEncrypt = await this.httpApi.encrypt(JSON.stringify(username), "http://localhost:9000/api/rsa/GetPublicKey");

    this.httpApi.disableUser(usernameEncrypt).subscribe({
      next: value =>  {
         this.toastr.success("User disable successfully", 'Success');
      },
      error: err => {
         this.toastr.error("Something's error", 'Error');
      }
    })
  }

  openDeleteDialog(id: string, username: string): void {
    const dialogRef = this.dialog.open(ModaleDeleteComponent, {
      data: { Id: id, Username : username, ClassForm: this.classForm } // passo l'ID
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

  openCreateUserDialog(person: User): void {
    if (this.auth.isAuthenticated()) {
      const dialogRef = this.dialog.open(ModaleCreateUserComponent, {
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

      // Chiamata alla funzione di reset della password
      this.httpApi.forgotPwdByEmail(email, null).subscribe(
        {
          next: value => {
            // Disabilita il pulsante
            this.resetButtonDisabled[email] = true;
            // Mette il colore grigio
            this.buttonColor[email] = 'grey';

            this.toastr.success("We have sent a reset password link to the email. Please check.", "Success")
          },
          error: err => {
            this.toastr.error("Something went error", "Error")
          },
          complete: () => {
            setTimeout(() => {
              this.resetButtonDisabled[email] = false;
              this.buttonColor[email] = 'primary';
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
