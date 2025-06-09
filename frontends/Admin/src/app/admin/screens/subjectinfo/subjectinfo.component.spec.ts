import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectinfoComponent } from './subjectinfo.component';

describe('SubjectinfoComponent', () => {
  let component: SubjectinfoComponent;
  let fixture: ComponentFixture<SubjectinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubjectinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
