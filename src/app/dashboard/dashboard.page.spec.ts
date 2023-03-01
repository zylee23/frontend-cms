import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("FAB is initialised", () => {
    const fabElement = fixture.debugElement.nativeElement.getElementsByTagName("ion-fab-button");
    expect(fabElement.length).toEqual(1);
  });

  it("FAB Button opens the create appointment/encounter modal", fakeAsync(() => {
    spyOn(component, "createAppointment");

    const createBtn: HTMLButtonElement = fixture.debugElement.nativeElement.querySelector("#createAppointment");
    createBtn.click();
    tick();

    expect(component.createAppointment).toHaveBeenCalled();
  }));
});
