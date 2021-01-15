import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MachinePrinterComponent } from './machine-printer.component';

describe('MachinePrinterComponent', () => {
  let component: MachinePrinterComponent;
  let fixture: ComponentFixture<MachinePrinterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MachinePrinterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachinePrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
