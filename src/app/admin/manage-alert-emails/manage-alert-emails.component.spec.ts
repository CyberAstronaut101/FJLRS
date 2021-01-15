import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ManageAlertEmailsComponent } from './manage-alert-emails.component';

describe('ManageAlertEmailsComponent', () => {
  let component: ManageAlertEmailsComponent;
  let fixture: ComponentFixture<ManageAlertEmailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAlertEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAlertEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
