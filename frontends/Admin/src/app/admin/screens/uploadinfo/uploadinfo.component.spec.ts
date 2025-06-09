import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadinfoComponent } from './uploadinfo.component';

describe('UploadinfoComponent', () => {
  let component: UploadinfoComponent;
  let fixture: ComponentFixture<UploadinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadinfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
