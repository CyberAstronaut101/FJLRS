import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintJobFormComponent } from './print-job-form.component';

describe('PrintJobFormComponent', () => {
  let component: PrintJobFormComponent;
  let fixture: ComponentFixture<PrintJobFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintJobFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintJobFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
