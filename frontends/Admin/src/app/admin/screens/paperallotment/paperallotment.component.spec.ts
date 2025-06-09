import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperallotmentComponent } from './paperallotment.component';

describe('PaperallotmentComponent', () => {
  let component: PaperallotmentComponent;
  let fixture: ComponentFixture<PaperallotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperallotmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperallotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
