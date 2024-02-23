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
import { HomepageComponent } from './homepage/homepage.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidenavService } from './service/SidenavService';
import { CreateUserEmailComponent } from './create-user-email/create-user-email.component';
import { ModaleSendEmailPwdComponent } from './modale-send-email-pwd/modale-send-email-pwd.component';
import { ModaleUpdateOrgComponent } from './organizzazione/modale-update-org/modale-update-org.component';
import { ModaleUpdatePersoneComponent } from './persone/modale-update-persone/modale-update-persone.component';
import { ModaleUpdateUserComponent } from './utenti/modale-update-user/modale-update-user.component';
import { ModaleAddPersoneComponent } from './persone/modale-add-persone/modale-add-persone.component';
import { ModaleAddUserComponent } from './utenti/modale-add-user/modale-add-user.component';
import { ModaleDeleteComponent } from './modale-delete/modale-delete.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ModaleDetailsOrgComponent } from './organizzazione/modale-details-org/modale-details-org.component';
import { ModaleDetailsPersoneComponent } from './persone/modale-details-persone/modale-details-persone.component';
import {HttpClientModule} from "@angular/common/http";
import {ToastrModule} from "ngx-toastr";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";

@NgModule({
  declarations: [
    AppComponent,
    OrganizzazioneComponent,
    PersoneComponent,
    UtentiComponent,
    NavbarComponent,
    SidebarComponent,
    HomepageComponent,
    CreateUserEmailComponent,
    ModaleUpdateOrgComponent,
    ModaleSendEmailPwdComponent,
    ModaleUpdatePersoneComponent,
    ModaleUpdateUserComponent,
    ModaleAddPersoneComponent,
    ModaleAddUserComponent,
    ModaleDeleteComponent,
    ModaleDetailsOrgComponent,
    ModaleDetailsPersoneComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        NgxIntlTelInputModule
    ],
  providers: [
    SidenavService
  ],
  exports: [
    SidebarComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
