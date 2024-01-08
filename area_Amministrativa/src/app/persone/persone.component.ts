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

/*export interface FilterDTO {
  first_name: string;
  last_name: string;
}*/

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
  IsValid: boolean;
  IsDeleted: boolean;
}

@Component({
  selector: 'app-persone',
  templateUrl: './persone.component.html',
  styleUrls: ['./persone.component.css']
})

export class PersoneComponent {
  @ViewChild('filterFirstName') filterFirstNameInput: MatInput | undefined; // Riferimento all'input di firstName
  @ViewChild('filterLastName') filterLastNameInput: MatInput | undefined; // Riferimento all'input di lastName

  filterFirstName = ''; // Aggiungi questa linea per il valore del filtro per firstName
  filterLastName = ''; // Aggiungi questa linea per il valore del filtro per lastName
  //filterForm: FormGroup
  classForm: string = "People";
  PeopleList: PersonDTO[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'phone', 'workRole', 'email', 'update'];
  dataSource = new MatTableDataSource<PersonDTO>;

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private httpApi: HttpProviderService) {
    this.dataSource = new MatTableDataSource<PersonDTO>(this.PeopleList);
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
    return (data: PersonDTO, filter: string): boolean => {
      const searchText = JSON.parse(filter);
      return (
        data.firstName.toLowerCase().includes(searchText.firstName) &&
        data.lastName.toLowerCase().includes(searchText.lastName)
      );
    };
  }

  applyFilter() {
    // Applica il filtro in base alle proprietà firstName e lastName
    const filterValue = { firstName: this.filterFirstName.toLowerCase(), lastName: this.filterLastName.toLowerCase() };
    this.dataSource.filter = JSON.stringify(filterValue);
  }
  allPeople() {
    this.httpApi.getAllPeople().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            this.PeopleList = resultData;
            this.dataSource.data = [...this.PeopleList];
            console.log(this.PeopleList);

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
    const dialogRef = this.dialog.open(ModaleAddPersoneComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }


  openUpdateDialog(person: PersonDTO): void {
    const dialogRef = this.dialog.open(ModaleUpdatePersoneComponent, {
      width: '60%',

      data: { person: person }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDetailsDialog(person: PersonDTO): void {
    const dialogRef = this.dialog.open(ModaleDetailsPersoneComponent, {
      width: '60%',

      data: { person: person }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
