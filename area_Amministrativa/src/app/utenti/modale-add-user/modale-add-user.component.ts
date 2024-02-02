import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserDTO, UserDTO1} from "../utenti.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpProviderService} from "../../service/http-provider.service";


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
    private formBuilder: FormBuilder,
    private httpApi: HttpProviderService
  ) {
    // Inizializza il FormGroup con le regole di validazione
    this.newUserForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
       role: ['', Validators.required] // Imposta il valore di default
    });
  }

  onAddClick(): void {
    if (this.newUserForm.valid) {
      const newUser: UserDTO1 = {
        username: this.newUserForm.value.username,
        password: this.newUserForm.value.password,
        role: this.newUserForm.value.role
      };

      // post for create new user
      //this.httpApi.addNewUser(newUser).subscribe();
    }
    this.closepopup();
    window.location.reload();
  }

  closepopup(): void {
    this.dialogRef.close();
  }


}
