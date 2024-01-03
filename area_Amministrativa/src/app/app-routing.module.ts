import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrganizzazioneComponent} from "./organizzazione/organizzazione.component";
import {UtentiComponent} from "./utenti/utenti.component";
import {PersoneComponent} from "./persone/persone.component";
import {AreaLoginComponent} from "./area-login/area-login.component";
import {isAuthGuardComponent} from "./auth-guard/auth-guard.component";
import {MyAccountComponent} from "./my-account/my-account.component";

// vari path
const routes: Routes = [
  {path: '', component: AreaLoginComponent},
  {path: 'organizzazione', component : OrganizzazioneComponent,
      canActivate: [isAuthGuardComponent],
      data: {
      role: 'ROLE_ADMIN'
    }},
  {path: 'persone', component : PersoneComponent,
      canActivate: [isAuthGuardComponent],
      data: {
      role: 'ROLE_ADMIN'
    }},
  {path: 'my-account', component: MyAccountComponent,
      canActivate: [isAuthGuardComponent],
      data: {
      role: 'ROLE_ADMIN'
      }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
