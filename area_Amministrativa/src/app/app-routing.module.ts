import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrganizzazioneComponent} from "./organizzazione/organizzazione.component";

// vari path
const routes: Routes = [
  {path: 'organizzazione', component : OrganizzazioneComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
