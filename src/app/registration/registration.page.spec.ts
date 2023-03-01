import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '../app.module';

import { RegistrationPage } from './registration.page';

describe('RegistrationPage', () => {
  let component: RegistrationPage;
  let fixture: ComponentFixture<RegistrationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrationPage ],
      imports: [
        IonicModule.forRoot(),
        AppModule,
        ReactiveFormsModule,
        HttpClientModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Registration component should created', () => {
    expect(component).toBeDefined();
  });

  it("All Form Controls are initialised", () => {
    // Retrieve Registration Form element
    const formElement = fixture.debugElement.nativeElement.querySelector("#registrationForm");
    // Retrieve all Form Control elements
    const inputElements = formElement.getElementsByTagName("ion-input");
    const inputSelectElements = formElement.getElementsByTagName("ion-select");
    expect(inputElements.length).toEqual(8);
    expect(inputSelectElements.length).toEqual(4);
  });

  it("All Form Controls are initialised with default values", () => {
    const registrationFormGroup = component.registrationForm;
    const registrationFormValues = {
      name: null,
      dob: null,
      clinic: null,
      address1: null,
      address2: null,
      city: null,
      postcode: null,
      state: null,
      contactNumber: null,
      email: null,
      newPassword: null,
      reNewPassword: null,
    }
    expect(registrationFormGroup.value).toEqual(registrationFormValues);
  });

  it("Submit button is disabled before filling required Form Controls", () => {
    // Retrieve Registration Form element
    const formElement = fixture.debugElement.nativeElement.querySelector("#registrationForm");
    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = formElement.querySelector("#btnSubmit");
    expect(button.disabled).toBeTrue();
  });

  it("Submit button is enabled after filling required Form Controls", () => {
    // Set the name input field
    const name: string = "Peter Parker";
    component.registrationForm.controls["name"].setValue(name);

    // Set the dob input field
    const dob: string = "2022-09-01";
    component.registrationForm.controls["dob"].setValue(dob);

    // Set the clinic input field
    const clinic: number = 1;
    component.registrationForm.controls["clinic"].setValue(clinic);

    // Set the address1 input field
    const address1: string = "1408 Longview Avenue, Queens";
    component.registrationForm.controls["address1"].setValue(address1);

    // Set the state input field
    const state: string = "Kuala Lumpur";
    component.registrationForm.controls["state"].setValue(state);

    // Set the city input field
    const city: string = "Subang Jaya";
    component.registrationForm.controls["city"].setValue(city);

    // Set the postcode input field
    const postcode: string = "11413";
    component.registrationForm.controls["postcode"].setValue(postcode);

    // Set the contactNumber input field
    const contactNumber: string = "0123456789";
    component.registrationForm.controls["contactNumber"].setValue(contactNumber);

    // Set the email input field
    const email: string = "peterparker@email.com";
    component.registrationForm.controls["email"].setValue(email);

    // Set the newPassword input field
    const newPassword: string = "#fit3162";
    component.registrationForm.controls["newPassword"].setValue(newPassword);

    // Set the reNewPassword input field
    const reNewPassword: string = "#fit3162";
    component.registrationForm.controls["reNewPassword"].setValue(reNewPassword);

    // Perform data binding
    fixture.detectChanges();

    // Retrieve Registration Form element
    const formElement = fixture.debugElement.nativeElement.querySelector("#registrationForm");
    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = formElement.querySelector("#btnSubmit");
    expect(button.disabled).toBeFalse();
  });
});
