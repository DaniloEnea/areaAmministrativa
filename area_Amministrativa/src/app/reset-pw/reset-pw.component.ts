import {Component, OnInit} from '@angular/core';
import {ResetPasswordDto} from "../interfaces/ResetPasswordDto";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {HttpProviderService} from "../service/http-provider.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MaterialModule} from "../material/material.module";
import {getMatIconFailedToSanitizeLiteralError} from "@angular/material/icon";
import {catchError, map, of} from "rxjs";
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-reset-pw',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './reset-pw.component.html',
  styleUrl: './reset-pw.component.css'
})

export class ResetPwComponent  implements OnInit{
  resetPasswordForm!: FormGroup;
  showSuccess!: boolean;
  showError!: boolean;
  errorMessage!: string;
  resetButtonDisabled: boolean = false;
  successMessage!: string;

  hide1: boolean = true;
  hide2: boolean = true;

  private token!: string;

  constructor(private auth: AuthService, private http: HttpProviderService, private route: ActivatedRoute, private router: Router) {

  }


  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('', [Validators.required]),
      hide1: new FormControl(true), // Aggiungi hide1 come FormControl
      hide2: new FormControl(true), // Aggiungi hide2 come FormControl
    }, { validators: this.passwordsMustMatchValidator });

    this.resetPasswordForm.get('confirm')?.setValidators([Validators.required]);
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
      this.resetPasswordForm.get(controlName)?.invalid &&
      this.resetPasswordForm.get(controlName)?.touched
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
    const control = this.resetPasswordForm.get(controlName);
    return control ? control.hasError(errorName) : false;
  }

  private passwordsMustMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirm = control.get('confirm');

    return password && confirm && password.value !== confirm.value ? { mustMatch: true } : null;
  };


  // function to call api
  public resetPassword = (resetPasswordFormValue: any) => {
    this.resetButtonDisabled = true;
    this.showError = this.showSuccess = false;
    const resetPass = { ...resetPasswordFormValue };

    if (resetPass.password !== resetPass.confirm) {
      this.showError = true;
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const resetPassDto: ResetPasswordDto = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this.token,
    };

    this.http.resetPwdByEmail(resetPassDto).subscribe({
      next: () => {
        this.showSuccess = true;
        this.successMessage = "Your password has been reset.";

        this.route.queryParams.subscribe(params => {
          const email = this.auth.getUsernameFromJwt();
          if (email === params['email']) {
            setTimeout(() => {
              this.auth.logout();
            }, 2000);
          }
          else if (email != null) {
            setTimeout(() => {
              this.router.navigate(['']);
            }, 2000);
          }
          else {
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = err.message;
      },
    });
  };
}
