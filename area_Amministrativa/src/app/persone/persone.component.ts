import { Component } from '@angular/core';
import { ModaleDeleteComponent } from "../modale-delete/modale-delete.component";
import { ModaleUpdatePersoneComponent } from "./modale-update-persone/modale-update-persone.component";
import { ModaleAddPersoneComponent } from "./modale-add-persone/modale-add-persone.component";
import { MatDialog } from "@angular/material/dialog";
import * as jsonData from '../person.json'
import { MatTableDataSource } from "@angular/material/table";


export interface PersonDTO {
  first_name: string;
  last_name: string;
  CF: string;
  role: string;
  phone_number: string;
  email: string;
  email_2: string;
  GDPR_accepted: boolean;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}  

@Component({
  selector: 'app-persone',
  templateUrl: './persone.component.html',
  styleUrls: ['./persone.component.css']
})

export class PersoneComponent {
  displayedColumns: string[] = ['first_name', 'last_name', 'phone_number', 'email', 'update'];
  dataSource = new MatTableDataSource<PersonDTO>(jsonData);
  protected readonly alert = alert;
  constructor(private dialog: MatDialog) { }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ModaleDeleteComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ModaleAddPersoneComponent, {
      width: '60%',   // Set width to 60%  of the window's total width
      height: '60%',  // Set height to 50% of the window's total height
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(ModaleUpdatePersoneComponent, {
      width: '60%',   // Set width to 60%  of the window's total width
      height: '60%',  // Set height to 50% of the window's total height
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
