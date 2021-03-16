import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActiveJobsComponent } from './account-active-jobs.component';

describe('AccountActiveJobsComponent', () => {
  let component: AccountActiveJobsComponent;
  let fixture: ComponentFixture<AccountActiveJobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountActiveJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActiveJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
