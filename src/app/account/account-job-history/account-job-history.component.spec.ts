import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountJobHistoryComponent } from './account-job-history.component';

describe('AccountJobHistoryComponent', () => {
  let component: AccountJobHistoryComponent;
  let fixture: ComponentFixture<AccountJobHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountJobHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountJobHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
