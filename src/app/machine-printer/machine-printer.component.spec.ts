import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinePrinterComponent } from './machine-printer.component';

describe('MachinePrinterComponent', () => {
  let component: MachinePrinterComponent;
  let fixture: ComponentFixture<MachinePrinterComponent>;

  beforeEach(async(() => {
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
