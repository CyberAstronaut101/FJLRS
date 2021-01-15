import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewemailaccountComponent } from './newemailaccount.component';

describe('NewemailaccountComponent', () => {
  let component: NewemailaccountComponent;
  let fixture: ComponentFixture<NewemailaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewemailaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewemailaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
