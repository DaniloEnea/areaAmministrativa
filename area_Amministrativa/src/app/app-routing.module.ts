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
import { CreateUserEmailComponent } from './create-user-email/create-user-email.component';

// vari path
const routes: Routes = [
  { path: 'login', component: AreaLoginComponent },
  { path: 'create_user', component: CreateUserEmailComponent },

  {path: '', component: HomepageComponent, canActivate: [isAuthGuardComponent],
    data: {
      role: ['ROLE_SA', 'ROLE_ADMIN']
    }
  },

  {path: 'organizzazione', component : OrganizzazioneComponent,
      canActivate: [isAuthGuardComponent],
      data: {
        role: ['ROLE_SA', 'ROLE_ADMIN']
    }
  },

  {path: 'persone', component : PersoneComponent,
      canActivate: [isAuthGuardComponent],
      data: {
        role: ['ROLE_SA', 'ROLE_ADMIN']
    }
  },

  {path: 'my-account', component: MyAccountComponent,
      canActivate: [isAuthGuardComponent],
      data: {
        role: ['ROLE_SA', 'ROLE_ADMIN']
    }
  },

  { path: 'reset_password', component: ResetPwComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
