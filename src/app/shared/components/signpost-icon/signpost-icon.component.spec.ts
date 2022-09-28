import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignpostIconComponent } from './signpost-icon.component';

describe('SignpostIconComponent', () => {
  let component: SignpostIconComponent;
  let fixture: ComponentFixture<SignpostIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignpostIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignpostIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
