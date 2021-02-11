import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterManagementComponent } from './printer-management.component';

describe('PrinterManagementComponent', () => {
  let component: PrinterManagementComponent;
  let fixture: ComponentFixture<PrinterManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
