import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import { ModaleAddUserComponent } from "./modale-add-user/modale-add-user.component";
import { ModaleUpdateUserComponent } from "./modale-update-user/modale-update-user.component";
import { ModaleDeleteComponent } from "../modale-delete/modale-delete.component";
import {MatTableDataSource} from "@angular/material/table";
import {HttpProviderService} from "../service/http-provider.service";

export interface UserDTO{
  id: number;
  username: string;
  password: string;
  role: string;
}

export interface UserDTO1{
  username: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.css']
})

export class UtentiComponent implements OnInit{
  UtentiList: UserDTO[] = [];
  displayedColumns: string[] = ['username', 'password', 'role', 'update'];
  dataSource: MatTableDataSource<UserDTO>;

  constructor(private dialog: MatDialog, private httpApi: HttpProviderService) {
    this.dataSource = new MatTableDataSource<UserDTO>(this.UtentiList);
  }


  ngOnInit() {
   this.allUtenti();
  }

  /* METHOD FOR USER'S */

  //get all user's
   allUtenti() {
    this.httpApi.getAllUtente().subscribe({
      next: (data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            this.UtentiList = resultData;
            this.dataSource.data = [...this.UtentiList]; // Usando lo spread operator per creare un nuovo array
            console.log(this.UtentiList);
          }
        }
      },
      error: (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.UtentiList = [];
              this.dataSource.data = [...this.UtentiList]; // Usando lo spread operator per creare un nuovo array
            }
          }
        }
      }
    });
  }


  // modal delete
  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(ModaleDeleteComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openUpdateDialog(user: UserDTO): void {
    const dialogRef = this.dialog.open(ModaleUpdateUserComponent, {
      width: '60%',   // Set width to 60%  of the window's total width
      height: '50%',  // Set height to 50% of the window's total height

       data: { user: user } // Passa l'oggetto UserDTO come parte dei dati del dialogo
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
