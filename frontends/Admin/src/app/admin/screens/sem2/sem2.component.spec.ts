import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sem2Component } from './sem2.component';

describe('Sem2Component', () => {
  let component: Sem2Component;
  let fixture: ComponentFixture<Sem2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Sem2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sem2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
