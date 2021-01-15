import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageHoursComponent } from './manage-hours.component';

describe('ManageHoursComponent', () => {
  let component: ManageHoursComponent;
  let fixture: ComponentFixture<ManageHoursComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
