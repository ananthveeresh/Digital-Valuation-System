import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusinfoComponent } from './campusinfo.component';

describe('CampusinfoComponent', () => {
  let component: CampusinfoComponent;
  let fixture: ComponentFixture<CampusinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampusinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
