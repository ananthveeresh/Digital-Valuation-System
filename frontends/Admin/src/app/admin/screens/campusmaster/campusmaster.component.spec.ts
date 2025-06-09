import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusmasterComponent } from './campusmaster.component';

describe('CampusmasterComponent', () => {
  let component: CampusmasterComponent;
  let fixture: ComponentFixture<CampusmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampusmasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
