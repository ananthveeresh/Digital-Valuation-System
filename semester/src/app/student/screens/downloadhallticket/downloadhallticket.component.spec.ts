import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadhallticketComponent } from './downloadhallticket.component';

describe('DownloadhallticketComponent', () => {
  let component: DownloadhallticketComponent;
  let fixture: ComponentFixture<DownloadhallticketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadhallticketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadhallticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
