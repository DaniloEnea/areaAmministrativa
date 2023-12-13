import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrganizzazioneComponent} from "./organizzazione/organizzazione.component";
import {UtentiComponent} from "./utenti/utenti.component";
import {PersoneComponent} from "./persone/persone.component";
import {AreaLoginComponent} from "./area-login/area-login.component";

// vari path
const routes: Routes = [
  {path: 'login', component: AreaLoginComponent},
  {path: 'organizzazione', component : OrganizzazioneComponent},
  {path: 'utenti', component : UtentiComponent},
  {path: 'persone', component : PersoneComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
