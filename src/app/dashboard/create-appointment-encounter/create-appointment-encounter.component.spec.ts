import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CreateAppointmentEncounterComponent } from './create-appointment-encounter.component';
import { AppModule } from '../../app.module';

describe('CreateAppointmentEncounterComponent', () => {
  let component: CreateAppointmentEncounterComponent;
  let fixture: ComponentFixture<CreateAppointmentEncounterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAppointmentEncounterComponent ],
      imports: [
        IonicModule.forRoot(),
        AppModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAppointmentEncounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Set to admin by default
    component.role = "ADMIN";
    fixture.detectChanges();
  }));

  it('CreateAppointmentEncounterComponent should be created', () => {
    expect(component).toBeDefined();
  });

  it("Check number of input fields when logged in as a patient", () => {
    component.role = "PATIENT";
    fixture.detectChanges();

    // Check all ion-input fields
    const ionInputs: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-input");
    expect(ionInputs.length).toBe(2);

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
    expect(ionInputs.length).toBe(2);

    // Check all ion-select fields
    const ionSelects: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-select");
    expect(ionSelects.length).toBe(3);

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
    expect(titles).toContain("Appointment");
    expect(titles).toContain("Reset");
  });

  it("Check number of buttons when logged in as an admin", () => {
    const ionButtons: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-button");
    const titles: string[] = Array.from(ionButtons).map(e => e.textContent.trim());
    expect(ionButtons.length).toBe(4);
    expect(titles).toContain("Appointment");
    expect(titles).toContain("Encounter");
    expect(titles).toContain("Reset");
  });

  it("All Form Controls are initialised with default values", () => {
    const createFormGroup = component.form;
    const createFormValues = {
      patient: null,
      clinic: null,
      date: formatDate(new Date(), "yyyy-MM-dd", "en"),
      time: formatDate(new Date(), "HH:mm", "en"),
      doctor: null,
      comment: null
    }
    expect(createFormGroup.value).toEqual(createFormValues);
  });

  it("Check create appointment button is disabled if form is incomplete", () => {
    const htmlEl: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#createAppointment");
    expect(htmlEl.disabled).toBeTrue();
  });

  it("Check create encounter button is disabled if form is incomplete", () => {
    const htmlEl: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#createEncounter");
    expect(htmlEl.disabled).toBeTrue();
  });

  it("Check create button is enabled if form is complete", () => {
    component.form.setValue({
      patient: 1,
      clinic: 1,
      date: "2022-10-10",
      time: "22:00",
      doctor: 1,
      comment: "Test"
    });
    fixture.detectChanges();

    const createAppointmentBtn: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#createAppointment");
    expect(createAppointmentBtn.disabled).toBeFalse();
    const createEncounterBtn: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#createEncounter");
    expect(createEncounterBtn.disabled).toBeFalse();
  });

  it("Create appointment button creates an appointment", fakeAsync(() => {
    spyOn(component, "createAppointment");

    const createAppointmentBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#createAppointment");
    createAppointmentBtn.click();
    tick();

    expect(component.createAppointment).toHaveBeenCalled();
  }));

  it("Create encounter button creates an encounter", fakeAsync(() => {
    spyOn(component, "createEncounter");

    const createEncounterBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#createEncounter");
    createEncounterBtn.click();
    tick();

    expect(component.createEncounter).toHaveBeenCalled();
  }));

});
