import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionschemalistComponent } from './questionschemalist.component';

describe('QuestionschemalistComponent', () => {
  let component: QuestionschemalistComponent;
  let fixture: ComponentFixture<QuestionschemalistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionschemalistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionschemalistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
