import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionreportComponent } from './sectionreport.component';

describe('SectionreportComponent', () => {
  let component: SectionreportComponent;
  let fixture: ComponentFixture<SectionreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
