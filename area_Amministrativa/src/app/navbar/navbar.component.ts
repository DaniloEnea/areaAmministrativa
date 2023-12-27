import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SidenavService } from '../service/SidenavService';
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private sidenavService: SidenavService, private router: Router) {

  }

  toggleSidenav() {
    this.sidenavService.toggle();
  }

  logout() {
    localStorage.removeItem("accessToken");
    this.router.navigate([('')]).then(r => null);
    console.log("logout successful");
  }

}
