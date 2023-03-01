import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const username: string = "Peter Parker";
  const role: string = "ADMIN";

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        AppModule,
      ],
      providers: [
        AuthService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    component.username = username;
    component.role = role;
    fixture.detectChanges();
  }));

  it('AppComponent should be created', () => {
    expect(component).toBeDefined();
  });

  it("Check if username is displayed correctly", () => {
    const usernameEl: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-card-title");
    expect(usernameEl.length).toBe(1);
    expect(usernameEl[0].textContent).toEqual(username);
  });

  it("Check if role is displayed correctly", () => {
    const roleEl: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-card-content");
    expect(roleEl.length).toBe(1);
    expect(roleEl[0].textContent).toEqual(role);
  });

  it("Check all dashboard buttons are displayed when logged in as admin", () => {
    const dashboardBtns: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-menu-toggle");
    const titles: string[] = Array.from(dashboardBtns).map(e => e.textContent.trim());
    expect(dashboardBtns.length).toBe(3);
    expect(titles).toContain("Dashboard");
    expect(titles).toContain("Create");
    expect(titles).toContain("Logout");
  });

  it("Check all dashboard buttons are displayed when logged in as patient", () => {
    component.role = "PATIENT";
    fixture.detectChanges();

    const dashboardBtns: HTMLCollection = fixture.debugElement.nativeElement.getElementsByTagName("ion-menu-toggle");
    const titles: string[] = Array.from(dashboardBtns).map(e => e.textContent.trim());
    expect(dashboardBtns.length).toBe(2);
    expect(titles).toContain("Dashboard");
    expect(titles).toContain("Logout");
  });

  it("Logout button logs out the current user", fakeAsync(() => {
    spyOn(component, "onLogout");

    const logoutBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#onLogout");
    logoutBtn.click();
    tick();

    expect(component.onLogout).toHaveBeenCalled();
  }));

});
