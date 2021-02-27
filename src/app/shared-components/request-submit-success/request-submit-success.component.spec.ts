import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSubmitSuccessComponent } from './request-submit-success.component';

describe('RequestSubmitSuccessComponent', () => {
  let component: RequestSubmitSuccessComponent;
  let fixture: ComponentFixture<RequestSubmitSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestSubmitSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSubmitSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
