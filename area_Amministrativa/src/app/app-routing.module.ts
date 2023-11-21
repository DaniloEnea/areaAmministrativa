import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizzazioneComponent } from "./organizzazione/organizzazione.component";
import { PersoneComponent } from "./persone/persone.component";

// vari path
const routes: Routes = [
  { path: 'organizzazione', component: OrganizzazioneComponent },
  { path: 'persone', component: PersoneComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
