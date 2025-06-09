import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodehubComponent } from './barcodehub.component';

describe('BarcodehubComponent', () => {
  let component: BarcodehubComponent;
  let fixture: ComponentFixture<BarcodehubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodehubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodehubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
