import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewDeptInfoDialogComponent } from './new-dept-info-dialog.component';

describe('NewDeptInfoDialogComponent', () => {
  let component: NewDeptInfoDialogComponent;
  let fixture: ComponentFixture<NewDeptInfoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDeptInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDeptInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
