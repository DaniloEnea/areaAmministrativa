  import {Component, Inject} from '@angular/core';
  import {MatButtonModule} from "@angular/material/button";
  import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
  import {MatFormFieldModule} from "@angular/material/form-field";
  import {MatInputModule} from "@angular/material/input";
  import {MatSlideToggleModule} from "@angular/material/slide-toggle";
  import {NgIf} from "@angular/common";
  import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
  import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
  import {AuthService} from "../../service/auth.service";
  import {PersonDTO, PersonDTO1, User} from "../persone.component";
  import {HttpProviderService} from "../../service/http-provider.service";
  import {ToastrService} from "ngx-toastr";

  @Component({
    selector: 'app-modale-create-user',
    standalone: true,
      imports: [
          MatButtonModule,
          MatDialogModule,
          MatFormFieldModule,
          MatInputModule,
          MatSlideToggleModule,
          NgIf,
          NgxIntlTelInputModule,
          ReactiveFormsModule
      ],
    templateUrl: './modale-create-user.component.html',
    styleUrl: './modale-create-user.component.css'
  })
  export class ModaleCreateUserComponent {
   createUserForm: FormGroup;
    rolesSelected: string[] = [];
    IsSA = true;

    constructor(public auth: AuthService, public dialogRef: MatDialogRef<ModaleCreateUserComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { person: User },
      private formBuilder: FormBuilder,
      private httpApi: HttpProviderService, private toastr: ToastrService) {


      this.IsSA = auth.checkIsSA();

      this.createUserForm = this.formBuilder.group({
        email: [this.data.person.email, Validators.required],
        Role_SA: [this.roleCheck("ROLE_SA")],
        Role_Admin: [this.roleCheck("ROLE_ADMIN")]
      });
    }

    // @ts-ignore
    getWorkroleError() {
      // @ts-ignore
      if (this.workRole.hasError('required')) {
        return 'This field is required.';
      }
    }

    // @ts-ignore
    getSecondEmailError() {
      // @ts-ignore
      if (this.secondEmail.hasError('email')) {
        return 'Please enter a valid email address.';
      }
    }

    roleCheck(role: string): boolean {
      if (this.data.person.roles != null) {
        return this.data.person.roles.includes(role);
      }
      else return false;
    }

    generatePassword(length: number): string {
    // Definizione dei caratteri che la password può contenere
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";

    // Generazione della password
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }

    return password;
  }

    onCreateUserClick(): void {
      if (this.auth.isAuthenticated()) {
        if (this.createUserForm.valid) {

          if (this.createUserForm.value.Role_SA == true) {
            this.rolesSelected.push("ROLE_SA")
          }
          if (this.createUserForm.value.Role_Admin == true) {
            this.rolesSelected.push("ROLE_ADMIN")
          }
          this.rolesSelected.push("ROLE_USER")

          console.log(this.rolesSelected)

          const createUser: User = {
            password: this.generatePassword(12),
            email: this.data.person.email,
            id: this.data.person.id,
            roles: this.rolesSelected,
          };

          console.log(createUser);
          this.createUser(createUser).then();
        }
      }
      else {
        this.toastr.error("Token is expired", "Error")
        setTimeout(() => {
          window.location.reload();
        }, 500)
      }
    }

    // funzione per creare l'utenza
    async createUser(model: any) {
      try {
        const createUserEncrypt = await this.httpApi.encrypt(JSON.stringify(model), "http://localhost:9000/api/rsa/GetPublicKey");

        this.httpApi.createUserEncrypted(createUserEncrypt).subscribe({
          next: async (encryptedResponse) => {
            this.toastr.success("Create user successful", "Success");
            console.log(this.data.person.email)
            console.log(this.createUserForm.value.email);
            setTimeout(() => {
              this.httpApi.sendEmailCreation(this.createUserForm.value.email, null).subscribe(
                {
                  next: value => {
                    this.toastr.success("The create email has been send.", "Success")

                  },
                  error: err => {
                    this.toastr.error("There is a problem with the email", "Error")
                  },
                  complete: () => {
                    setTimeout(() => {

                    }, 30000);
                  }
                }
              );
            }, 5000);
            this.closepopup()
          },
          error: err => {
            this.toastr.error("User exists", "Error");
            console.log(err);
          }
        });
      } catch (error) {
        console.log(error);
        this.toastr.error("Encryption failed or unable to fetch the public key", "Error");
      }
    }

    closepopup(): void {
      this.dialogRef.close();
    }
  }
