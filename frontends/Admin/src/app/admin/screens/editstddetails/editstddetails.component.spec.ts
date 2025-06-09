import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditstddetailsComponent } from './editstddetails.component';

describe('EditstddetailsComponent', () => {
  let component: EditstddetailsComponent;
  let fixture: ComponentFixture<EditstddetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditstddetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditstddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
