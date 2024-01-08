import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SidenavService } from '../service/SidenavService';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent{


  @ViewChild('sidenav') public sidenav!: MatSidenav;
  constructor(private sidenavService: SidenavService) { }
  
  ngOnInit() {
    this.sidenavService.isOpen$.subscribe(() => {
      if (this.sidenav) {
        this.sidenav.toggle();
      }
    });
  }

  onClick() {
    this.sidenav.toggle();
  }
}
