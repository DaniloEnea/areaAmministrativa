import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserDTO} from "../utenti.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-modale-add',
  templateUrl: './modale-add-user.component.html',
  styleUrls: ['./modale-add-user.component.css']
})
export class ModaleAddUserComponent {

  newUserForm: FormGroup; // Definisci il FormGroup per la gestione dei dati del nuovo utente

  constructor(
    public dialogRef: MatDialogRef<ModaleAddUserComponent>,
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

  onAddClick(): void {
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
