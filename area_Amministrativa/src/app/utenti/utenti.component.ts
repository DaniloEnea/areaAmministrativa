import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import { ModaleAddUserComponent } from "./modale-add-user/modale-add-user.component";
import { ModaleUpdateUserComponent } from "./modale-update-user/modale-update-user.component";
import { ModaleDeleteComponent } from "../modale-delete/modale-delete.component";
import * as jsonData from '../utenti.json'
import {MatTableDataSource} from "@angular/material/table";

export interface UserDTO{
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.css']
})

export class UtentiComponent {
  displayedColumns: string[] = ['username', 'password', 'role', 'update'];
  dataSource = new MatTableDataSource<UserDTO>(jsonData);
  protected readonly alert = alert;

  // modal
 constructor(private dialog: MatDialog) {}

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ModaleDeleteComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(ModaleUpdateUserComponent, {
      width: '60%',   // Set width to 60%  of the window's total width
      height: '50%',  // Set height to 50% of the window's total height
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ModaleAddUserComponent,{
      width:'60%',   // Set width to 60%  of the window's total width
      height:'50%',  // Set height to 50% of the window's total height
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
