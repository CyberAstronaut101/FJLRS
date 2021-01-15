import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeptInfoDialogComponent } from './new-dept-info-dialog.component';

describe('NewDeptInfoDialogComponent', () => {
  let component: NewDeptInfoDialogComponent;
  let fixture: ComponentFixture<NewDeptInfoDialogComponent>;

  beforeEach(async(() => {
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
