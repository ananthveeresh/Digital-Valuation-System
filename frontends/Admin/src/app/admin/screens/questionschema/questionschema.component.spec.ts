import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionschemaComponent } from './questionschema.component';

describe('QuestionschemaComponent', () => {
  let component: QuestionschemaComponent;
  let fixture: ComponentFixture<QuestionschemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionschemaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionschemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
