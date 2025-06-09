import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatesemComponent } from './createsem.component';

describe('CreatesemComponent', () => {
  let component: CreatesemComponent;
  let fixture: ComponentFixture<CreatesemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatesemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatesemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
