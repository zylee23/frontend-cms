import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '../app.module';
import { AuthPage } from './auth.page';

describe('AuthPage', () => {
  let component: AuthPage;
  let fixture: ComponentFixture<AuthPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthPage ],
      imports: [
        IonicModule.forRoot(),
        AppModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Auth page should created', () => {
    expect(component).toBeDefined();
  });

  it("All Form Controls are initialised", () => {
    // Retrieve all Form Control elements
    const inputElements = fixture.debugElement.nativeElement.getElementsByTagName("ion-input");
    expect(inputElements.length).toEqual(2);
  });

  it("All Form Controls are initialised with default values", () => {
    const loginFormGroup = component.loginForm;
    const loginFormValues = {
      email: null,
      password: null
    }
    expect(loginFormGroup.value).toEqual(loginFormValues);
  });

  it("Check number of buttons", () => {
    const ionButtons: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-button");
    const titles: string[] = Array.from(ionButtons).map(e => e.textContent.trim());
    expect(ionButtons.length).toBe(2);
    expect(titles).toContain("Login");
    expect(titles).toContain("Create an account");
  });

  it("Login button is disabled before filling required Form Controls", () => {
    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#login");
    expect(button.disabled).toBeTrue();
  });

  it("Login button is enabled after filling required Form Controls", () => {
    // Set the email input field
    const email: string = "admin@example.com";
    component.loginForm.controls["email"].setValue(email);

    // Set the password input field
    const password: string = "1234567";
    component.loginForm.controls["password"].setValue(password);

    // Perform data binding
    fixture.detectChanges();

    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#login");
    expect(button.disabled).toBeFalse();
  });

  it("Login button calls the onSubmit function", fakeAsync(() => {
    spyOn(component, "onSubmit");

    const loginBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#login");
    loginBtn.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it("Create an account button calls the goToRegistration function", fakeAsync(() => {
    spyOn(component, "goToRegistration");

    const goToRegistrationBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#createAccount");
    goToRegistrationBtn.click();
    tick();

    expect(component.goToRegistration).toHaveBeenCalled();
  }));

});
