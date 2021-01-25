import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitJobRequestComponent } from './submit-job-request.component';

describe('SubmitJobRequestComponent', () => {
  let component: SubmitJobRequestComponent;
  let fixture: ComponentFixture<SubmitJobRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitJobRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitJobRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
