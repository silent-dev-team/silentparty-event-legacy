import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DjformComponent } from './djform.component';

describe('DjformComponent', () => {
  let component: DjformComponent;
  let fixture: ComponentFixture<DjformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DjformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DjformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
