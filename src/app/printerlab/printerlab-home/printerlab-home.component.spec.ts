import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrinterlabHomeComponent } from './printerlab-home.component';

describe('PrinterlabHomeComponent', () => {
  let component: PrinterlabHomeComponent;
  let fixture: ComponentFixture<PrinterlabHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterlabHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterlabHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
