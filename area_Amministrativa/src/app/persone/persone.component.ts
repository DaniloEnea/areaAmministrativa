import { Component, OnInit } from '@angular/core';
import { ModaleDeleteComponent } from "../modale-delete/modale-delete.component";
import { ModaleUpdatePersoneComponent } from "./modale-update-persone/modale-update-persone.component";
import { ModaleAddPersoneComponent } from "./modale-add-persone/modale-add-persone.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { HttpProviderService } from "../service/http-provider.service";
import { ModaleDetailsPersoneComponent } from './modale-details-persone/modale-details-persone.component';


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
  classForm: string = "People";
  PeopleList: PersonDTO[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'phone', 'workRole', 'email', 'update'];
  dataSource = new MatTableDataSource<PersonDTO>;

  constructor(private dialog: MatDialog, private httpApi: HttpProviderService) {
    this.dataSource = new MatTableDataSource<PersonDTO>(this.PeopleList);
  }

  ngOnInit() {
    this.allPeople();
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
