import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailhistorytableComponent } from './emailhistorytable.component';

describe('EmailhistorytableComponent', () => {
  let component: EmailhistorytableComponent;
  let fixture: ComponentFixture<EmailhistorytableComponent>;

  beforeEach(async(() => {
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
