import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { CalendarEvent } from 'angular-calendar';
import { addHours } from 'date-fns';
import { AppModule } from 'src/app/app.module';
import { Encounter } from 'src/app/model/encounter.model';

import { EditEncounterComponent } from './edit-encounter.component';

describe('EditEncounterComponent', () => {
  let component: EditEncounterComponent;
  let fixture: ComponentFixture<EditEncounterComponent>;

  const _dateTime = new Date("2022-09-17T01:00:00");
  const _doctor = {
    doctor_id: 1,
    doctor_name: "Strange",
    doctor_dob: "2022-08-25",
    doctor_address: "string",
    doctor_contact: "0123456789",
  };
  const _clinic = {
    clinic_id: 1,
    clinic_name: "Klinik Kesihatan",
    clinic_address: "Address",
    clinic_contact: "0312456789",
  };
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
    encounter_clinic: _clinic,
    encounter_patient: _patient,
    encounter_doctor: _doctor,
    encounter_comments: "Annual Checkup",
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEncounterComponent ],
      imports: [
        IonicModule.forRoot(),
        AppModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: NavParams,
          useValue: {
            data: {
              event: <CalendarEvent<Encounter>>{
                id: 1,
                start: _dateTime,
                end: addHours(_dateTime, 1),
                title: `Testing Encounter 1`,
                meta: encounter,
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Set to admin by default
    component.role = "ADMIN";
    fixture.detectChanges();
  }));

  it('EditEncounterComponent should be created', () => {
    expect(component).toBeDefined();
  });

  it("Check date is correctly initialised", () => {
    const htmlEl: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector("#date");
    expect(htmlEl.value).toBe(encounter.encounter_date);
  });

  it("Check time is correctly initialised", () => {
    const htmlEl: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector("#time");
    expect(htmlEl.value).toBe(encounter.encounter_time);
  });

  it("Check doctor is correctly initialised", () => {
    const htmlEl: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector("#doctor");
    expect(+htmlEl.value).toEqual(_doctor.doctor_id);
  });

  it("Check clinic is correctly initialised", () => {
    const htmlEl: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector("#clinic");
    expect(+htmlEl.value).toEqual(_clinic.clinic_id);
  });

  it("Check patient is correctly initialised", () => {
    const htmlEl: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector("#patientDetail");

    // Since the patient details is displayed with a prefix, we use toContain
    // to check whether the patient name is initialised correctly
    expect(htmlEl.value).toContain(_patient.patient_name);
  });

  it("Check comments are correctly displayed", () => {
    const htmlEl: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector("#comment");
    expect(htmlEl.value).toBe(encounter.encounter_comments);
  });

  it("Check number of input fields when logged in as a patient", () => {
    component.role = "PATIENT";
    fixture.detectChanges();

    // Check all ion-input fields
    const ionInputs: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-input");
    expect(ionInputs.length).toBe(3);

    // Check all ion-select fields
    const ionSelects: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-select");
    expect(ionSelects.length).toBe(2);

    // Check all ion-textarea fields
    const ionTextareas: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-textarea");
    expect(ionTextareas.length).toBe(1);
  });

  it("Check number of input fields when logged in as an admin", () => {
    // Check all ion-input fields
    const ionInputs: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-input");
    expect(ionInputs.length).toBe(4);

    // Check all ion-select fields
    const ionSelects: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-select");
    expect(ionSelects.length).toBe(2);

    // Check all ion-textarea fields
    const ionTextareas: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-textarea");
    expect(ionTextareas.length).toBe(1);
  });

  it("Check number of buttons when logged in as a patient", () => {
    component.role = "PATIENT";
    fixture.detectChanges();

    const ionButtons: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-button");
    const titles: string[] = Array.from(ionButtons).map(e => e.textContent.trim());
    expect(ionButtons.length).toBe(2);
    expect(titles).toContain("Diagnosis");
  });

  it("Check number of buttons when logged in as an admin", () => {
    const ionButtons: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-button");
    const titles: string[] = Array.from(ionButtons).map(e => e.textContent.trim());
    expect(ionButtons.length).toBe(4);
    expect(titles).toContain("Diagnosis");
    expect(titles).toContain("Edit");
    expect(titles).toContain("Delete");
  });

  it("Check edit button is enabled if form is complete", () => {
    const htmlEl: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#editEncounter");
    expect(htmlEl.disabled).toBeFalse();
  });

  it("Check edit, diagnosis and delete button is disabled if form is incomplete", () => {
    component.form.setValue({
      title: null,
      id: null,
      appointment: null,
      patient: null,
      patientDetail: null,
      clinic: null,
      date: null,
      time: null,
      doctor: null,
      comment: null,
    });
    fixture.detectChanges();

    const editBtn: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#editEncounter");
    expect(editBtn.disabled).toBeTrue();
    const diagBtn: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#goToDiagnosis");
    expect(diagBtn.disabled).toBeTrue();
    const delBtn: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#deleteEncounter");
    expect(delBtn.disabled).toBeTrue();
  });

  it("Edit button saves the current form state", fakeAsync(() => {
    spyOn(component, "editEncounter");

    const editBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#editEncounter");
    editBtn.click();
    tick();

    expect(component.editEncounter).toHaveBeenCalled();
  }));

  it("Diagnosis button navigates users to diagnosis page", fakeAsync(() => {
    spyOn(component, "goToDiagnosis");

    const diagBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#goToDiagnosis");
    diagBtn.click();
    tick();

    expect(component.goToDiagnosis).toHaveBeenCalled();
  }));

  it("Delete button deletes the current encounter", fakeAsync(() => {
    spyOn(component, "deleteEncounter");

    const delBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#deleteEncounter");
    delBtn.click();
    tick();

    expect(component.deleteEncounter).toHaveBeenCalled();
  }));
});
