import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '../app.module';
import { CreatePage } from './create.page';

describe('CreatePage', () => {
  let component: CreatePage;
  let fixture: ComponentFixture<CreatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePage ],
      imports: [
        IonicModule.forRoot(),
        AppModule,
        ReactiveFormsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();

  }));

  it('Create component should created', () => {
    expect(component).toBeDefined();
  });

  it("Mode Form Control is initialised", () => {
    // Retrieve all Form Control elements
    const selectElements: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-select");
    expect(selectElements.length).toEqual(1);
  });

  it("All Create Admin/Doctor/Patient Form Controls are initialised", () => {
    component.mode.setValue("Patient");
    fixture.detectChanges();

    // Retrieve all Form Control elements
    const inputElements = fixture.debugElement.nativeElement.getElementsByTagName("ion-input");
    const selectElements: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-select");
    expect(inputElements.length).toEqual(8);
    expect(selectElements.length).toEqual(5);
  });

  it("All Create Clinic Form Controls are initialised", () => {
    component.mode.setValue("Clinic");
    fixture.detectChanges();

    // Retrieve all Form Control elements
    const inputElements = fixture.debugElement.nativeElement.getElementsByTagName("ion-input");
    const selectElements: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-select");
    expect(inputElements.length).toEqual(4);
    expect(selectElements.length).toEqual(4);
  });

  it("All Create Admin/Doctor/Patient Form Controls are initialised with default values", () => {
    component.mode.setValue("Doctor");
    fixture.detectChanges();

    const createFormGroup = component.createForm;
    const createFormValues = {
      name: null,
      dob: null,
      clinic: null,
      address1: null,
      address2: null,
      state: null,
      city: null,
      postcode: null,
      contactNumber: null,
      email: null,
      password: null,
      confirmPassword: null
    }
    expect(createFormGroup.value).toEqual(createFormValues);
  });

  it("All Create Clinic Form Controls are initialised with default values", () => {
    component.mode.setValue("Clinic");
    fixture.detectChanges();

    const createFormGroup = component.createForm;
    const createFormValues = {
      name: null,
      address1: null,
      address2: null,
      state: null,
      city: null,
      postcode: null,
      contactNumber: null
    }
    expect(createFormGroup.value).toEqual(createFormValues);
  });

  it("Check number of buttons", () => {
    const ionButtons: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-button");
    const titles: string[] = Array.from(ionButtons).map(e => e.textContent.trim());
    expect(ionButtons.length).toBe(2);
    expect(titles).toContain("Create");
    expect(titles).toContain("Reset");
  });

  it("Check create button is disabled if form is incomplete", () => {
    const htmlEl: HTMLButtonElement =
      fixture.debugElement.nativeElement.querySelector("#create");
    expect(htmlEl.disabled).toBeTrue();
  });

  it("Create Admin/Patient/Doctor button is enabled after filling required Form Controls", () => {
    component.mode.setValue("Patient");
    fixture.detectChanges();

    const name: string = "Peter parker";
    component.createForm.controls["name"].setValue(name);

    const dob: string = "2000-01-01";
    component.createForm.controls["dob"].setValue(dob);

    const clinic: number = 1;
    component.createForm.controls["clinic"].setValue(clinic);

    const address1: string = "Jalan 1";
    component.createForm.controls["address1"].setValue(address1);

    const state: string = "Selangor";
    component.createForm.controls["state"].setValue(state);

    const city: string = "Kajang";
    component.createForm.controls["city"].setValue(city);

    const postcode: string = "43000";
    component.createForm.controls["postcode"].setValue(postcode);

    const contactNumber: string = "0123456789";
    component.createForm.controls["contactNumber"].setValue(contactNumber);

    const email: string = "patient@example.com";
    component.createForm.controls["email"].setValue(email);

    const password: string = "1234567";
    component.createForm.controls["password"].setValue(password);

    const confirmPassword: string = "1234567";
    component.createForm.controls["confirmPassword"].setValue(confirmPassword);

    // Perform data binding
    fixture.detectChanges();

    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#create");
    expect(button.disabled).toBeFalse();
  });

  it("Create Clinic button is enabled after filling required Form Controls", () => {
    component.mode.setValue("Clinic");
    fixture.detectChanges();

    const name: string = "Clinic Test";
    component.createForm.controls["name"].setValue(name);

    const address1: string = "Jalan 1";
    component.createForm.controls["address1"].setValue(address1);

    const state: string = "Selangor";
    component.createForm.controls["state"].setValue(state);

    const city: string = "Kajang";
    component.createForm.controls["city"].setValue(city);

    const postcode: string = "43000";
    component.createForm.controls["postcode"].setValue(postcode);

    const contactNumber: string = "0123456789";
    component.createForm.controls["contactNumber"].setValue(contactNumber);

    // Perform data binding
    fixture.detectChanges();

    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#create");
    expect(button.disabled).toBeFalse();
  });

  it("Create button calls the onSubmit function", fakeAsync(() => {
    spyOn(component, "onSubmit");

    const createBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#create");
    createBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
  }));

});
