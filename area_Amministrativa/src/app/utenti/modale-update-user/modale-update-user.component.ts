import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {UserDTO, UserDTO1} from "../utenti.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {HttpProviderService} from "../../service/http-provider.service";

@Component({
  selector: 'app-modale-update',
  templateUrl: './modale-update-user.component.html',
  styleUrls: ['./modale-update-user.component.css']
})
export class ModaleUpdateUserComponent implements OnInit{

  updateUserForm: FormGroup; // Definisci il FormGroup per la gestione dei dati del nuovo utente

  constructor(
    public dialogRef: MatDialogRef<ModaleUpdateUserComponent>,
   @Inject(MAT_DIALOG_DATA) public data: { user: UserDTO },
    private httpApi: HttpProviderService,
    private formBuilder: FormBuilder // Inietta il FormBuilder
  ) {
    // Inizializza il FormGroup con le regole di validazione
    this.updateUserForm = this.formBuilder.group({
      username: [this.data.user.username , Validators.required],
      password: [this.data.user.password, Validators.required],
      role: [this.data.user.role, Validators.required]
    });
  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdateClick(): void {
    if (this.updateUserForm.valid) {
      const newUser: UserDTO1 = {
        username: this.updateUserForm.value.username,
        password: this.updateUserForm.value.password,
        role: this.updateUserForm.value.role
      };

      // invia la richiesta
      //this.httpApi.updateUser(this.data.user.id, newUser).subscribe()

      this.dialogRef.close(newUser);
      window.location.reload();
    }
  }

  closepopup(): void {
    this.dialogRef.close();
  }



}
