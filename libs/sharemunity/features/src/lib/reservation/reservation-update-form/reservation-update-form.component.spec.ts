import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservationUpdateFormComponent } from './reservation-update-form.component';

describe('ReservationUpdateFormComponent', () => {
  let component: ReservationUpdateFormComponent;
  let fixture: ComponentFixture<ReservationUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationUpdateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
