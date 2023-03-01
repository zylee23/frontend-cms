import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MicrophoneComponent } from './microphone.component';

describe('MicrophoneComponent', () => {
  const formControlName: string = "test-form-control-name";

  let component: MicrophoneComponent;
  let fixture: ComponentFixture<MicrophoneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicrophoneComponent ],
      imports: [
        IonicModule.forRoot(),
        HttpClientModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MicrophoneComponent);
    component = fixture.componentInstance;
    component.input = formControlName;
    fixture.detectChanges();
  }));

  it("Microphone component should be created", () => {
    expect(component).toBeDefined();
  });

  it("Microphone component should initialised with default values", () => {
    // Test @Input property
    expect(component.input).toBe(formControlName);
    // Test boolean flag
    expect(component.isRecording).toBeFalse();
    // Test if correct icon is used
    const ionIcon: HTMLElement = fixture.debugElement.nativeElement.getElementsByTagName("ion-icon")[0];
    const icon = ionIcon.getAttribute("ng-reflect-name");
    expect(icon).toBe("mic-outline");
  });

  it("Tapping microphone button should trigger recording", fakeAsync(() => {
    spyOn(component, "onTapMicrophone");

    const micTapBtn: HTMLButtonElement = fixture.debugElement.nativeElement.getElementsByTagName("ion-button")[0];
    micTapBtn.click();
    tick();

    expect(component.onTapMicrophone).toHaveBeenCalled();
  }));

  it("Microphone component after tapping record button", () => {
    component.isRecording = true;
    fixture.detectChanges();

    // Test if correct icon is used
    const ionIcon: HTMLElement = fixture.debugElement.nativeElement.getElementsByTagName("ion-icon")[0];
    const icon = ionIcon.getAttribute("ng-reflect-name");
    expect(icon).toBe("close-circle");
  });
});
