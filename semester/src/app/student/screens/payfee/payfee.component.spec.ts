import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayfeeComponent } from './payfee.component';

describe('PayfeeComponent', () => {
  let component: PayfeeComponent;
  let fixture: ComponentFixture<PayfeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayfeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayfeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
