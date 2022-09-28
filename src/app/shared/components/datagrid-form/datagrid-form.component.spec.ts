import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatagridFormComponent } from './datagrid-form.component';

describe('DatagridFormComponent', () => {
  let component: DatagridFormComponent;
  let fixture: ComponentFixture<DatagridFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatagridFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatagridFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
