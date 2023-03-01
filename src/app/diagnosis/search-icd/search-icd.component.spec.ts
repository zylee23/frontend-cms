import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchICDComponent } from './search-icd.component';
import { AppModule } from '../../app.module';

describe('SearchICDComponent', () => {
  let component: SearchICDComponent;
  let fixture: ComponentFixture<SearchICDComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchICDComponent ],
      imports: [
        IonicModule.forRoot(),
        AppModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchICDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('Search ICD component should created', () => {
    expect(component).toBeDefined();
  });

  it("All Form Controls are initialised", () => {
    const inputSearchElements = fixture.debugElement.nativeElement.getElementsByTagName("ion-searchbar");
    const inputSelectElements = fixture.debugElement.nativeElement.getElementsByTagName("ion-select");
    expect(inputSearchElements.length).toEqual(1);
    expect(inputSelectElements.length).toEqual(1);
  });

  it("All Form Controls are initialised with default values", () => {
    const formGroup = component.form;
    const formValues = {
      icd: null
    }
    expect(formGroup.value).toEqual(formValues);
  });

  it("Select button is disabled before filling required Form Controls", () => {
    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#select");
    expect(button.disabled).toBeTrue();
  });

  it("Select button is enabled after filling required Form Controls", () => {
    // Set the icd field
    const icd: string = "A01: Fever";
    component.form.controls["icd"].setValue(icd);

    // Perform data binding
    fixture.detectChanges();

    // Check if the button is enabled (i.e. button disabled = false)
    const button: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#select");
    expect(button.disabled).toBeFalse();
  });

  it("Select button saves the current form state", fakeAsync(() => {
    spyOn(component, "onSelect");

    const selectBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#select");
    selectBtn.click();
    tick();

    expect(component.onSelect).toHaveBeenCalled();
  }));

});
