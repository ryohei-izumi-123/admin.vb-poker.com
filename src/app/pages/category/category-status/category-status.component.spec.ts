import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryStatusComponent } from './category-status.component';

describe('CategoryStatusComponent', () => {
  let component: CategoryStatusComponent;
  let fixture: ComponentFixture<CategoryStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
