import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '../app.module';
import { Encounter } from '../model/encounter.model';
import { DiagnosisPage } from './diagnosis.page';

describe('DiagnosisPage', () => {
  let component: DiagnosisPage;
  let fixture: ComponentFixture<DiagnosisPage>;

  const _patient = {
    patient_id: 1,
    patient_name: "Peter",
    patient_dob: "2022-08-15",
    patient_address: "Malaysia",
    patient_contact: "0123456789",
  };
  const encounter: Encounter = {
    encounter_id: 1,
    encounter_date: "2022-09-17",
    encounter_time: "01:00:00",
    encounter_appointment: 1,
    encounter_created_by: 1,
    encounter_clinic: 1,
    encounter_patient: _patient,
    encounter_doctor: 1,
    encounter_comments: "Annual Checkup",
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnosisPage ],
      imports: [
        IonicModule.forRoot(),
        AppModule,
        ReactiveFormsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DiagnosisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Set to admin by default
    component.role = "ADMIN";
    // set to not edit by default
    component.editMode = false;
    fixture.detectChanges();
  }));

  it('Diagnosis component should created', () => {
    expect(component).toBeDefined();
  });

  it("All Form Controls are initialised", () => {
    // Retrieve all Form Control elements
    const inputElements = fixture.debugElement.nativeElement.getElementsByTagName("ion-input");
    const inputTextAreaElements: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-textarea");
    expect(inputElements.length).toEqual(10);
    expect(inputTextAreaElements.length).toEqual(4);
  });

  it("All Form Controls are initialised with default values", () => {
    const diagnosisFormGroup = component.form;
    const diagnosisFormValues = {
      diagnosisId: null,
      encounterId: null,
      name: null,
      age: null,
      weight: null,
      height: null,
      signsSymptoms: null,
      history: null,
      bloodPressure: null,
      heartRate: null,
      respiratoryRate: null,
      oxygenSat: null,
      temp: null,
      icd: null,
      diagnosis: null,
      prescription: null
    }
    expect(diagnosisFormGroup.value).toEqual(diagnosisFormValues);
  });

  it("Check number of buttons when logged in as a patient", () => {
    component.role = "PATIENT";
    fixture.detectChanges();

    const ionButtons: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-button");
    const titles: string[] = Array.from(ionButtons).map(e => e.textContent.trim());
    expect(ionButtons.length).toBe(1);
  });

  it("Check number of buttons when logged in as an admin, editMode is false", () => {
    const ionButtons: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-button");
    const titles: string[] = Array.from(ionButtons).map(e => e.textContent.trim());
    expect(ionButtons.length).toBe(2);
    expect(titles).toContain("CONFIRM");
  });

  it("Check number of buttons when logged in as an admin, editMode is true", () => {
    component.editMode = true;
    fixture.detectChanges();

    const ionButtons: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-button");
    const titles: string[] = Array.from(ionButtons).map(e => e.textContent.trim());
    expect(ionButtons.length).toBe(2);
    expect(titles).toContain("UPDATE");
  });

  it("Check confirm button is disabled if form is incomplete", () => {
    const htmlEl: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#confirmDiagnosis");
    expect(htmlEl.disabled).toBeTrue();
  });

  it("Check update button is disabled if form is incomplete", () => {
    component.editMode = true;
    fixture.detectChanges();

    const htmlEl: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#updateDiagnosis");
    expect(htmlEl.disabled).toBeTrue();
  });

  it("Confirm button is enabled after filling required Form Controls", () => {
    // Set the encounterId input field
    const encounterId: number = 1;
    component.form.controls["encounterId"].setValue(encounterId);

    // Set the name input field
    const name: string = "Peter Parker";
    component.form.controls["name"].setValue(name);

    // Set the age input field
    const age: number = 18;
    component.form.controls["age"].setValue(age);

    // Set the diagnosis input field
    const diagnosis: string = "Fever";
    component.form.controls["diagnosis"].setValue(diagnosis);

    // Perform data binding
    fixture.detectChanges();

    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#confirmDiagnosis");
    expect(button.disabled).toBeFalse();
  });

  it("Update button is enabled after filling required Form Controls", () => {
    // Set the encounterId input field
    const encounterId: number = 1;
    component.form.controls["encounterId"].setValue(encounterId);

    // Set the name input field
    const name: string = "Peter Parker";
    component.form.controls["name"].setValue(name);

    // Set the age input field
    const age: number = 18;
    component.form.controls["age"].setValue(age);

    // Set the diagnosis input field
    const diagnosis: string = "Fever";
    component.form.controls["diagnosis"].setValue(diagnosis);

    component.editMode = true;

    // Perform data binding
    fixture.detectChanges();

    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#updateDiagnosis");
    expect(button.disabled).toBeFalse();
  });

  it("Confirm button calls the create diagnosis function", fakeAsync(() => {
    spyOn(component, "onCreateDiagnosis");

    const createBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#confirmDiagnosis");
    createBtn.click();
    tick();

    expect(component.onCreateDiagnosis).toHaveBeenCalled();
  }));

  it("Update button calls the update diagnosis function", fakeAsync(() => {
    component.editMode = true;
    // Perform data binding
    fixture.detectChanges();

    spyOn(component, "onUpdateDiagnosis");

    const updateBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#updateDiagnosis");
    updateBtn.click();
    tick();

    expect(component.onUpdateDiagnosis).toHaveBeenCalled();
  }));

});
