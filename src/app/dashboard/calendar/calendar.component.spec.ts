import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';

import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarComponent ],
      imports: [
        IonicModule.forRoot(),
        AppModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('CalendarComponent should be created', () => {
    expect(component).toBeDefined();
  });

  it('Check if Calendar View is diplayed', () => {
    const calendarView: HTMLCollection =
      fixture.debugElement.nativeElement.getElementsByTagName("mwl-calendar-week-view");
    expect(calendarView.length).toBe(1);
  });
});
