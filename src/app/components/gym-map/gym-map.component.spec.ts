import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GymMapComponent } from './gym-map.component';

describe('GymMapComponent', () => {
  let component: GymMapComponent;
  let fixture: ComponentFixture<GymMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GymMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GymMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
