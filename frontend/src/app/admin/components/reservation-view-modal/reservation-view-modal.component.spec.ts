import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationViewModalComponent } from './reservation-view-modal.component';

describe('ReservationViewModalComponent', () => {
  let component: ReservationViewModalComponent;
  let fixture: ComponentFixture<ReservationViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
