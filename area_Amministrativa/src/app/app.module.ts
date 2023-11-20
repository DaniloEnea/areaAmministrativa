import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrganizzazioneComponent } from './organizzazione/organizzazione.component';
import { PersoneComponent } from './persone/persone.component';
import { UtentiComponent } from './utenti/utenti.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { ModaleComponent } from './modale/modale.component';

@NgModule({
  declarations: [
    AppComponent,
    OrganizzazioneComponent,
    PersoneComponent,
    UtentiComponent,
    NavbarComponent,
    ModaleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
