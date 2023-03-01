import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { toJson, UserRegistration, } from '../model/registration.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  api = environment.api_url;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
  ) {}

  /**
   * A validator to ensure that the password is re-entered correctly
   *
   * Adapted code from: https://aliasger.dev/quick-notes-implement-password-and-confirm-password-validation-in-angular
   *
   * @param source the new password form control name
   * @param target the re-enter new password form control name
   * @returns null if no errors, otherwise an object with a mismatch property
   */
   matchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }

  /**
   * Registers a new user account and display its status.
   */
  registerNewUser(userRegistration: UserRegistration) {
    this.registerUserRequest(userRegistration).subscribe(
      responseData => {
        // console.log(responseData);
        this.accountCreated();
      },
      errorData => {
        // console.log(errorData);
        this.accountNotCreated();
      }
    )
  }

  /**
   * Displays the account created prompt.
   */
  accountCreated() {
    // Prompt alert onto page
    this.alertController.create({
      header: "New Account Created",
      message: "Your account has been created successfully",
      buttons: [
        {
          text: "GET STARTED",
          handler: () => {
            this.router.navigateByUrl("/login");
          }
        },
      ],
    }).then(alertEl => {
      alertEl.present();
    });
  }

  /**
   * Displays the account not created prompt.
   */
  accountNotCreated() {
    // Prompt error message onto page
    this.alertController.create({
      header: "Error Occurred",
      message: "We have encountered an error, please try again later",
      buttons: [
        {
          text: "TRY AGAIN",
          role: "cancel",
        },
      ],
    }).then(alertEl => {
      alertEl.present();
    });
  }

  registerUserRequest(userRegistration: UserRegistration) {
    // console.log(userRegistration);
    const requestBody = toJson(userRegistration);

    // Make POST HTTP request to create new patient
    return this.http.post(`${this.api}/users/patients/create/`, requestBody);
  }
}
