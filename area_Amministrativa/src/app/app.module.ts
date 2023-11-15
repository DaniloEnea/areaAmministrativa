import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrganizzazioneComponent } from './organizzazione/organizzazione.component';
import { PersoneComponent } from './persone/persone.component';
import { UtentiComponent } from './utenti/utenti.component';

@NgModule({
  declarations: [
    AppComponent,
    OrganizzazioneComponent,
    PersoneComponent,
    UtentiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
