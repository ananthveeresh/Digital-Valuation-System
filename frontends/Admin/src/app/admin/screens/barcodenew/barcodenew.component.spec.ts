import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodenewComponent } from './barcodenew.component';

describe('BarcodenewComponent', () => {
  let component: BarcodenewComponent;
  let fixture: ComponentFixture<BarcodenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodenewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
