import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegstudentsComponent } from './regstudents.component';

describe('RegstudentsComponent', () => {
  let component: RegstudentsComponent;
  let fixture: ComponentFixture<RegstudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegstudentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegstudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
