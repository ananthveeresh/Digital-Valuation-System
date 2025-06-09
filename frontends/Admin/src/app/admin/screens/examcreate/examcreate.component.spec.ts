import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamcreateComponent } from './examcreate.component';

describe('ExamcreateComponent', () => {
  let component: ExamcreateComponent;
  let fixture: ComponentFixture<ExamcreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamcreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
