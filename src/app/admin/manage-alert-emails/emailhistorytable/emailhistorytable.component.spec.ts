import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailhistorytableComponent } from './emailhistorytable.component';

describe('EmailhistorytableComponent', () => {
  let component: EmailhistorytableComponent;
  let fixture: ComponentFixture<EmailhistorytableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailhistorytableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailhistorytableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
