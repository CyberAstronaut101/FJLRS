import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageDeptsComponent } from './manage-depts.component';

describe('ManageDeptsComponent', () => {
  let component: ManageDeptsComponent;
  let fixture: ComponentFixture<ManageDeptsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDeptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDeptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
