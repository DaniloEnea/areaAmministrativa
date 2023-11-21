import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ModaleAddComponent} from "./modale-add/modale-add.component";

export interface UserDTO{
  username: string;
  position: number;
  password: string;
  role: string;
}

const ELEMENT_DATA: UserDTO[] = [
  {position: 1, username: 'Simonsa', password: 'asas@as', role: 'ROLE_ADMIN'},
  {position: 2, username: 'Lucas', password: '121das', role: 'ROLE_USER'},
];

@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.css']
})
export class UtentiComponent {
  displayedColumns: string[] = ['position', 'username', 'password', 'role', 'update'];
  dataSource = ELEMENT_DATA;
  protected readonly alert = alert;

   // modal
 constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ModaleAddComponent,{
      width:'60%',   // Set width to 60%  of the window's total width
      height:'50%',  // Set height to 50% of the window's total height
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
