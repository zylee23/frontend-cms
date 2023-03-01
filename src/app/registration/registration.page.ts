import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ConvertedText } from '../model/converted-text';
import { MicrophoneService } from '../microphone/microphone.service';
import { RegistrationService } from './registration.service';
import { AppointmentEncounterService } from '../dashboard/create-appointment-encounter/appointment-encounter.service';
import { Clinic } from '../model/clinic.model';
import {
  getStates,
  getCities,
  getPostcodes
} from "malaysia-postcodes";

enum addressMode {
  STATE = "state",
  CITY = "city"
};

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit, OnDestroy {
  /**
   * The Registration FormGroup instance.
   */
  registrationForm: FormGroup;

  storeSub$: Subscription;
  clinics: Clinic[] = [];
  states: string[] = getStates();
  cities: string[];
  postcodes: string[];
  addressMode = addressMode;

  /**
   * A Subcription to listen for any transcribed text
   */
  private speechToTextSubcription: Subscription;

  constructor(
    private registrationService: RegistrationService,
    private microphoneService: MicrophoneService,
    private appointmentEncounterService: AppointmentEncounterService
  ) {}

  ngOnInit() {
    this.registrationForm = new FormGroup({
      // image: new FormControl(null),
      name: new FormControl(null, [
        Validators.required,
      ]),
      dob: new FormControl(null, [
        Validators.required,
      ]),
      clinic: new FormControl(null, [
        Validators.required
      ]),
      address1: new FormControl(null, [
        Validators.required,
      ]),
      address2: new FormControl(null),
      state: new FormControl(null, [
        Validators.required,
      ]),
      city: new FormControl(null, [
        Validators.required
      ]),
      postcode: new FormControl(null, [
        Validators.required,
      ]),
      contactNumber: new FormControl(null, [
        Validators.required,
        // Maximum contact number length of 11 digits, i.e. 99999999999 is the
        // maximum number it can have
        Validators.max(99999999999),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      newPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
      reNewPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
    }, [
      this.registrationService.matchValidator('newPassword', 'reNewPassword')
    ]);

    // Listen for any incoming transcribed texts
    this.speechToTextSubcription =
    this.microphoneService.transcribedText.subscribe(
      text => this.assignText(text)
      );

    this.storeSub$ = this.appointmentEncounterService.getAllClinics()
      .subscribe(clinics => {
          this.clinics = clinics;
        }
      );
  }

  onSubmit() {
    this.registrationService.registerNewUser(this.registrationForm.value);
  }

  /**
   * Assign the converted speech to text value to the corresponding input field
   *
   * @param text the converted text
   */
  assignText(text: ConvertedText) {
    switch (text.input) {
      case "name":
        this.registrationForm.patchValue({
          name: text.text,
        });
        break;
      case "address1":
        this.registrationForm.patchValue({
          address1: text.text,
        });
        break;
      case "address2":
        this.registrationForm.patchValue({
          address2: text.text,
        });
        break;
      // case "postcode":
      //   // Convert string to number
      //   const converted = wordToNumber(text.text).toString().replace(/ +/g, "");
      //   this.registrationForm.patchValue({
      //     postcode: converted,
      //   });
      //   break;
    }
  }

  addressSelectedChange(event: any, input: string) {
    if (event.target.value) {
      if (input === this.addressMode.STATE) {
        this.cities = getCities(event.target.value);
        this.registrationForm.get("city").reset();
      } else if (input === this.addressMode.CITY) {
        this.postcodes = getPostcodes(this.registrationForm.value.state, event.target.value);
      }
      this.registrationForm.get("postcode").reset();
    }
  }

  ngOnDestroy(): void {
    this.speechToTextSubcription.unsubscribe();
    this.storeSub$.unsubscribe();
  }

}
