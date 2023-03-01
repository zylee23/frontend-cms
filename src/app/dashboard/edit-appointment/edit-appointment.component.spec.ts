import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavParams } from '@ionic/angular';
import { CalendarEvent } from 'angular-calendar';
import { addHours } from 'date-fns';
import { AppModule } from 'src/app/app.module';
import { AppointmentStatus } from 'src/app/constants/appointment-status.constants';
import { Appointment } from 'src/app/model/appointment.model';

import { EditAppointmentComponent } from './edit-appointment.component';

describe('EditAppointmentComponent', () => {
  let component: EditAppointmentComponent;
  let fixture: ComponentFixture<EditAppointmentComponent>;

  const _dateTime = new Date("2022-09-13T01:00:00");
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
  const appointment: Appointment = {
    appointment_id: 1,
    appointment_date: "2022-09-13",
    appointment_time: "01:00:00",
    appointment_status: AppointmentStatus.REQUESTED,
    appointment_clinic: _clinic,
    appointment_patient: _patient,
    appointment_doctor: _doctor,
    appointment_comments: "Annual Checkup",
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAppointmentComponent ],
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
              event: <CalendarEvent<Appointment>>{
                id: 1,
                start: _dateTime,
                end: addHours(_dateTime, 1),
                title: `Testing Appointment 1`,
                meta: appointment,
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Set to admin by default
    component.role = "ADMIN";
    fixture.detectChanges();
  }));

  it('EditAppointmentComponent should be created', () => {
    expect(component).toBeDefined();
  });

  it("Check date is correctly initialised", () => {
    const htmlEl: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector("#date");
    expect(htmlEl.value).toBe(appointment.appointment_date);
  });

  it("Check time is correctly initialised", () => {
    const htmlEl: HTMLInputElement =
      fixture.debugElement.nativeElement.querySelector("#time");
    expect(htmlEl.value).toBe(appointment.appointment_time);
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
    expect(htmlEl.value).toBe(appointment.appointment_comments);
  });

  it("Check number of input fields when logged in as a patient", () => {
    component.role = "PATIENT";
    fixture.detectChanges();

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

  it("Check number of input fields when logged in as an admin", () => {
    // Check all ion-input fields
    const ionInputs: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-input");
    expect(ionInputs.length).toBe(5);

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
    expect(ionButtons.length).toBe(3);
    expect(titles).toContain("Edit");
    expect(titles).toContain("Cancel");
  });

  it("Check number of buttons when logged in as an admin", () => {
    const ionButtons: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-button");
    const titles: string[] = Array.from(ionButtons).map(e => e.textContent.trim());
    expect(ionButtons.length).toBe(4);
    expect(titles).toContain("Edit");
    expect(titles).toContain("Cancel");
    expect(titles).toContain("Encounter");
  });

  it("Check edit button is enabled if form is complete", () => {
    const htmlEl: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#editAppointment");
    expect(htmlEl.disabled).toBeFalse();
  });

  it("Check edit, encounter and cancel button is disabled if form is incomplete", () => {
    component.form.setValue({
      title: null,
      id: null,
      patient: null,
      patientDetail: null,
      clinic: null,
      date: null,
      time: null,
      doctor: null,
      comment: null,
      status: null,
    });
    fixture.detectChanges();

    const editBtn: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#editAppointment");
    expect(editBtn.disabled).toBeTrue();
    const encBtn: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#convertToEncounter");
    expect(encBtn.disabled).toBeTrue();
    const cancelBtn: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#cancelAppointment");
    expect(cancelBtn.disabled).toBeTrue();
  });

  it("Edit button saves the current form state", fakeAsync(() => {
    spyOn(component, "editAppointment");

    const editBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#editAppointment");
    editBtn.click();
    tick();

    expect(component.editAppointment).toHaveBeenCalled();
  }));

  it("Encounter button convert current appointment to an encounter", fakeAsync(() => {
    spyOn(component, "convertToEncounter");

    const encBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#convertToEncounter");
    encBtn.click();
    tick();

    expect(component.convertToEncounter).toHaveBeenCalled();
  }));

  it("Cancel button cancels the current appointment", fakeAsync(() => {
    spyOn(component, "cancelAppointment");

    const cancelBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#cancelAppointment");
    cancelBtn.click();
    tick();

    expect(component.cancelAppointment).toHaveBeenCalled();
  }));
});
