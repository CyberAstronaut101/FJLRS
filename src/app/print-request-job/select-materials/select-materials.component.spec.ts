import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMaterialsComponent } from './select-materials.component';

describe('SelectMaterialsComponent', () => {
  let component: SelectMaterialsComponent;
  let fixture: ComponentFixture<SelectMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
