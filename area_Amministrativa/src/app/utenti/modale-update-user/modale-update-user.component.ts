import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { UserDTO } from "../utenti.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-modale-update',
  templateUrl: './modale-update-user.component.html',
  styleUrls: ['./modale-update-user.component.css']
})
export class ModaleUpdateUserComponent {

  newUserForm: FormGroup; // Definisci il FormGroup per la gestione dei dati del nuovo utente

  constructor(
    public dialogRef: MatDialogRef<ModaleUpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDTO,
    private formBuilder: FormBuilder // Inietta il FormBuilder
  ) {
    // Inizializza il FormGroup con le regole di validazione
    this.newUserForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: [''] // Imposta il valore di default
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdateClick(): void {
    if (this.newUserForm.valid) {
      const newUser: UserDTO = {
        username: this.newUserForm.value.username,
        password: this.newUserForm.value.password,
        role: this.newUserForm.value.role
      };

      this.dialogRef.close(newUser);
      console.log(newUser)
    }
  }

  closepopup(): void {
    this.dialogRef.close();
  }
}
