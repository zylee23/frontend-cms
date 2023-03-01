import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CreateService } from './create.service';
import { RegistrationService } from '../registration/registration.service';
import { AppointmentEncounterService } from '../dashboard/create-appointment-encounter/appointment-encounter.service';
import { MicrophoneService } from '../microphone/microphone.service';
import { Clinic } from '../model/clinic.model';
import { ConvertedText } from '../model/converted-text';
import * as wordToNumber from 'word-to-numbers';
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
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, OnDestroy {

  storeSub$: Subscription;
  mode: FormControl;
  createForm: FormGroup;
  options: string[] = ["Admin", "Doctor", "Patient", "Clinic"];
  formFields: {
    label: string,
    formControl: string,
    type: string
  }[];
  clinics: Clinic[] = [];
  states: string[] = getStates();
  cities: string[];
  postcodes: string[];
  addressMode = addressMode;
  speechToTextSubcription$: Subscription;

  constructor(
    private createService: CreateService,
    private registrationService: RegistrationService,
    private appointmentEncounterService: AppointmentEncounterService,
    private microphoneService: MicrophoneService
  ) {}

  ngOnInit() {
    this.mode = new FormControl('', Validators.required);
    this.createForm = new FormGroup({});
    this.formFields = [];

    this.storeSub$ = this.appointmentEncounterService.getAllClinics()
      .subscribe(clinics => {
          this.clinics = clinics;
        }
      );
    this.speechToTextSubcription$ =
      this.microphoneService.transcribedText.subscribe(
        text => {
          if (this.mode.value === "Clinic")
            this.assignTextToClinic(text)
          else
            this.assignTextToUser(text);
        }
      );
  }

  selectionChanged() {
    const selected = this.mode.value;

    switch (selected) {
      case "Admin":
      case "Patient":
      case "Doctor":
        this.createForm = new FormGroup({
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
            Validators.required,
          ]),
          postcode: new FormControl(null, [
            Validators.required,
          ]),
          contactNumber: new FormControl(null, [
            Validators.required,
            Validators.maxLength(11)
          ]),
          email: new FormControl(null, [
            Validators.required,
            Validators.email,
          ]),
          password: new FormControl(null, [
            Validators.required,
            Validators.minLength(5)
          ]),
          confirmPassword: new FormControl(null, [
            Validators.required,
            Validators.minLength(5)
          ]),
        }, [
          this.registrationService.matchValidator("password", "confirmPassword")
        ]);
        this.formFields = [
          { label: "Name", formControl: "name", type: "text" },
          { label: "Date of Birth", formControl: "dob", type: "date" },
          { label: "Clinic", formControl: "clinic", type: "clinic" },
          { label: "Address 1", formControl: "address1", type: "text" },
          { label: "Address 2", formControl: "address2", type: "text" },
          { label: "State", formControl: "state", type: "state" },
          { label: "City", formControl: "city", type: "city" },
          { label: "Postcode", formControl: "postcode", type: "postcode" },
          { label: "Contact Number", formControl: "contactNumber", type: "contactNumber" },
          { label: "Email", formControl: "email", type: "email" },
          { label: "Password", formControl: "password", type: "password" },
          { label: "Re-enter Password", formControl: "confirmPassword", type: "password" },
        ];
        break;

        case "Clinic":
          this.createForm = new FormGroup({
            name: new FormControl(null, [
              Validators.required,
            ]),
            address1: new FormControl(null, [
              Validators.required,
            ]),
            address2: new FormControl(null),
            state: new FormControl(null, [
              Validators.required,
            ]),
            city: new FormControl(null, [
              Validators.required,
            ]),
            postcode: new FormControl(null, [
              Validators.required,
            ]),
            contactNumber: new FormControl(null, [
              Validators.required,
              Validators.maxLength(10)
            ])
          });
          this.formFields = [
            { label: "Clinic Name", formControl: "name", type: "text" },
            { label: "Address 1", formControl: "address1", type: "text" },
            { label: "Address 2", formControl: "address2", type: "text" },
            { label: "State", formControl: "state", type: "state" },
            { label: "City", formControl: "city", type: "city" },
            { label: "Postcode", formControl: "postcode", type: "postcode" },
            { label: "Contact Number", formControl: "contactNumber", type: "contactNumber" },
          ];
          break;

        default:
          break;
    }
  }

  onReset() {
    // this.mode.reset();
    this.createForm.reset();
  }

  onSubmit() {
    const selected = this.mode.value;

    switch (selected) {
      case "Admin":
        this.createService.createAdmin(this.createForm.value);
        break;

      case "Doctor":
        this.createService.createDoctor(this.createForm.value);
        break;

      case "Patient":
        this.createService.createPatient(this.createForm.value);
        break;

      case "Clinic":
        this.createService.createClinic(this.createForm.value);
        break;

      default:
        break;
    }

    this.onReset();
  }

  addressSelectedChange(event: any, input: string) {
    if (event.target.value) {
      if (input === this.addressMode.STATE) {
        this.cities = getCities(event.target.value);
        this.createForm.get("city").reset();
      } else if (input === this.addressMode.CITY) {
        this.postcodes = getPostcodes(this.createForm.value.state, event.target.value);
      }
      this.createForm.get("postcode").reset();
    }
  }

  /**
   * Assign the converted speech to text value to the corresponding user input
   * field.
   *
   * @param text the converted text
   */
  assignTextToUser(text: ConvertedText) {
    switch(text.input) {
      case "name":
        this.createForm.patchValue({
          name: text.text,
        });
        break;
      case "address1":
        this.createForm.patchValue({
          address1: text.text,
        });
        break;
      case "address2":
        this.createForm.patchValue({
          address2: text.text,
        });
        break;
      // case "city":
      //   this.createForm.patchValue({
      //     city: text.text,
      //   });
      //   break;
      // case "postcode":
      //   // Convert string to number
      //   const converted = wordToNumber(text.text).toString().replace(/ +/g, "");
      //   this.createForm.patchValue({
      //     postcode: converted,
      //   });
      //   break;
    }
  }

  /**
   * Assign the converted speech to text value to the corresponding clinic input
   * field.
   *
   * @param text the converted text
   */
  assignTextToClinic(text: ConvertedText) {
    switch(text.input) {
      case "name":
        this.createForm.patchValue({
          name: text.text,
        });
        break;
      case "address1":
        this.createForm.patchValue({
          address1: text.text,
        });
        break;
      case "address2":
        this.createForm.patchValue({
          address2: text.text,
        });
        break;
      // case "city":
      //   this.createForm.patchValue({
      //     city: text.text,
      //   });
      //   break;
      // case "postcode":
      //   // Convert string to number
      //   const converted = wordToNumber(text.text).toString().replace(/ +/g, "");
      //   this.createForm.patchValue({
      //     postcode: converted,
      //   });
      //   break;
    }
  }

  ngOnDestroy() {
    this.storeSub$.unsubscribe();
    this.speechToTextSubcription$.unsubscribe();
  }

}
