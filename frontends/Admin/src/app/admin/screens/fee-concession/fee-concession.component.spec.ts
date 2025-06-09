import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeConcessionComponent } from './fee-concession.component';

describe('FeeConcessionComponent', () => {
  let component: FeeConcessionComponent;
  let fixture: ComponentFixture<FeeConcessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeConcessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeeConcessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
