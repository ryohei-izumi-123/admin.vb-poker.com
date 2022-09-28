import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatalistFilterComponent } from './datalist-filter.component';

describe('DatalistFilterComponent', () => {
  let component: DatalistFilterComponent;
  let fixture: ComponentFixture<DatalistFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatalistFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatalistFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
