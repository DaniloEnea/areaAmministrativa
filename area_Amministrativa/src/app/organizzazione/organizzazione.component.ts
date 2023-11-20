import { Component } from '@angular/core';
import {ModaleComponent} from "../modale/modale.component";
import {MatDialog} from "@angular/material/dialog";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-organizzazione',
  templateUrl: './organizzazione.component.html',
  styleUrls: ['./organizzazione.component.css'],
})




export class OrganizzazioneComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'update'];
  dataSource = ELEMENT_DATA;
  protected readonly alert = alert;

  // modal
 constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ModaleComponent,{
      width:'60%',   // Set width to 60%  of the window's total width
      height:'50%',  // Set height to 50% of the window's total height
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
