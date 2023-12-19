import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SidenavService } from '../service/SidenavService';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  
  constructor(private sidenavService: SidenavService) {

  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }
}
