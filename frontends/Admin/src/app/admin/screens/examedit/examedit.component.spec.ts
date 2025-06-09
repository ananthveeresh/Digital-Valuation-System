import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExameditComponent } from './examedit.component';

describe('ExameditComponent', () => {
  let component: ExameditComponent;
  let fixture: ComponentFixture<ExameditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExameditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExameditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
