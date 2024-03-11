import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpProviderService } from '../service/http-provider.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { catchError, find, map, of } from 'rxjs';
import { ResetPasswordDto } from '../interfaces/ResetPasswordDto';
import { HttpErrorResponse } from '@angular/common/http';
import { PersonDTO, PersonDTO1 } from '../persone/persone.component';
import { GdprModaleComponent } from '../gdpr-modale/gdpr-modale.component';


export interface PasswordDTO {
  password: string;
  checkPwd: string;
}
export interface SendPasswordDTO {
  password: string;
}

@Component({
  selector: 'app-create-user-email',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './create-user-email.component.html',
  styleUrl: './create-user-email.component.css'
})
export class CreateUserEmailComponent {
  changePasswordForm!: FormGroup;
  showSuccess!: boolean;
  showError!: boolean;
  errorMessage!: string;
  successMessage!: string;
  resetButtonDisabled: boolean = false;
  LoadedData: boolean = true;

  hide1: boolean = true;
  hide2: boolean = true;

  private token!: string;

  constructor(public dialog: MatDialog, private http: HttpProviderService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('', [Validators.required]),
      isGdprAccepted: new FormControl(false, [Validators.requiredTrue]), // Aggiungi la checkbox e impostala come non selezionata di default
      hide1: new FormControl(true),
      hide2: new FormControl(true)
    }, { validators: this.passwordsMustMatchValidator });

    this.changePasswordForm.get('confirm')?.setValidators([Validators.required]);
    this.token = this.route.snapshot.queryParams['token'];

    // Verifica la validità del token
    this.isValidToken().subscribe((isValid) => {
      if (!isValid) {
        this.showError = true;
        this.errorMessage = 'Invalid token';
      }
    });
  }

  get visibilityIconPwd(): string {
    return this.hide1 ? 'visibility_off' : 'visibility';
  }
  get visibilityIconCheckPwd(): string {
    return this.hide2 ? 'visibility_off' : 'visibility';
  }

  public validateControl = (controlName: string) => {
    return (
      this.changePasswordForm.get(controlName)?.invalid &&
      this.changePasswordForm.get(controlName)?.touched
    );
  };

  private isValidToken() {
    return this.http.getTokenUrl(this.token).pipe(
      map((value: any) => {
        return value.body === true;
      }),
      catchError((err) => {
        console.log(err);
        return of(false);
      })
    );
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.changePasswordForm.get(controlName);
    return control ? control.hasError(errorName) : false;
  }

  private passwordsMustMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirm = control.get('confirm');

    return password && confirm && password.value !== confirm.value ? { mustMatch: true } : null;
  };


  // function to call api
  public changePassword = (changePasswordFormValue: any) => {
    this.LoadedData = false;
    this.showError = this.showSuccess = false;
    const changePass = { ...changePasswordFormValue };

    if (changePass.password !== changePass.confirm) {
      this.showError = true;
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const changePassDto: ResetPasswordDto = {
      password: changePass.password,
      confirmPassword: changePass.confirm,
      token: this.token,
    };

    this.route.queryParams.subscribe(params => {
      this.resetButtonDisabled = true;
      this.http.getAllPeople().subscribe({
        next: async (data: any) => {
          if (data != null && data.body != null) {

            var decryptedData: PersonDTO[] = this.http.decrypt(data.body)
            var result = decryptedData.find(person => person.Email === params['email']);
            if (result) {
              (await this.http.patchGDPRPerson(result.Id)).subscribe({
                next: () => {
                  this.http.resetPwdByEmail(changePassDto).subscribe({
                    next: () => {
                      this.showSuccess = true;
                      this.successMessage = "Your password has been reset.";

                      this.LoadedData = true;

                      // Attendere 3 secondi prima di eseguire il redirect
                      setTimeout(() => {
                        this.router.navigate(['/login']);
                      }, 2500);
                    },
                    error: (err: HttpErrorResponse) => {
                      this.LoadedData = true;
                      this.showError = true;
                      this.errorMessage = err.message;
                    },
                  })
                },
                error: () => {
                  this.LoadedData = true;
                  this.showError = true;
                  this.errorMessage = "Can't save person data";
                }
              });
            }
          }
        },
        error: () => {
          this.LoadedData = true;
          this.showError = true;
          this.errorMessage = "Can't get person data";
        }
      });
    });
  };

  public reload() {
    this.router.navigate(['/login']);
  }

  openGdprModale(): void {
    const dialogRef = this.dialog.open(GdprModaleComponent, {
      width: '80%',
      height: '80%'
    });
  }

}
