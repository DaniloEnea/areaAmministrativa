import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrganizzazioneComponent} from "./organizzazione/organizzazione.component";
import {UtentiComponent} from "./utenti/utenti.component";
import {PersoneComponent} from "./persone/persone.component";
import {AreaLoginComponent} from "./area-login/area-login.component";
import {isAuthGuardComponent} from "./auth-guard/auth-guard.component";

// vari path
const routes: Routes = [
  {path: '', component: AreaLoginComponent},
  {path: 'organizzazione', component : OrganizzazioneComponent, canActivate: [isAuthGuardComponent]},
  {path: 'persone', component : PersoneComponent, canActivate: [isAuthGuardComponent]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
