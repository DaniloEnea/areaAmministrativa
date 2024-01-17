import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrganizzazioneComponent} from "./organizzazione/organizzazione.component";
import {UtentiComponent} from "./utenti/utenti.component";
import {PersoneComponent} from "./persone/persone.component";
import {AreaLoginComponent} from "./area-login/area-login.component";
import {HomepageComponent } from "./homepage/homepage.component";
import {isAuthGuardComponent} from "./auth-guard/auth-guard.component";
import {MyAccountComponent} from "./my-account/my-account.component";
import {ResetPwComponent} from "./reset-pw/reset-pw.component";

// vari path
const routes: Routes = [
  { path: 'login', component: AreaLoginComponent },

  {path: '', component: HomepageComponent, canActivate: [isAuthGuardComponent],
    data: {
      role: 'ROLE_SA'
    }
  },

  {path: 'organizzazione', component : OrganizzazioneComponent,
      canActivate: [isAuthGuardComponent],
      data: {
      role: 'ROLE_SA'
    }
  },

  {path: 'persone', component : PersoneComponent,
      canActivate: [isAuthGuardComponent],
      data: {
      role: 'ROLE_SA'
    }
  },

  {path: 'my-account', component: MyAccountComponent,
      canActivate: [isAuthGuardComponent],
      data: {
      role: 'ROLE_SA'
    }
  },

  {path: 'reset_password', component: ResetPwComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
