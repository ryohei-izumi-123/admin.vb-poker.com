import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrayFilterComponent } from './array-filter.component';

describe('ArrayFilterComponent', () => {
  let component: ArrayFilterComponent;
  let fixture: ComponentFixture<ArrayFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArrayFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArrayFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
