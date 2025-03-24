import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGymListComponent } from './admin-gym-list.component';

describe('AdminGymListComponent', () => {
  let component: AdminGymListComponent;
  let fixture: ComponentFixture<AdminGymListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGymListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGymListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
