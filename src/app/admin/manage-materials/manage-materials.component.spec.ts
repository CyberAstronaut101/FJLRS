import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMaterialsComponent } from './manage-materials.component';

describe('ManageMaterialsComponent', () => {
  let component: ManageMaterialsComponent;
  let fixture: ComponentFixture<ManageMaterialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMaterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
