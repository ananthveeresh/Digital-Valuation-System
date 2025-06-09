import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentBarcodeComponent } from './studentbarcode.component';
describe('StudentbarcodeComponent', () => {
  let component: StudentBarcodeComponent;
  let fixture: ComponentFixture<StudentBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentBarcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
