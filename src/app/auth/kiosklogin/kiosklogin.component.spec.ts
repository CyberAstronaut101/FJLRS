import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KioskloginComponent } from './kiosklogin.component';

describe('KioskloginComponent', () => {
  let component: KioskloginComponent;
  let fixture: ComponentFixture<KioskloginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KioskloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
