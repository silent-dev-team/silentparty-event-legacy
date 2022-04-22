import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OkdialogComponent } from './okdialog.component';

describe('OkdialogComponent', () => {
  let component: OkdialogComponent;
  let fixture: ComponentFixture<OkdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OkdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OkdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
