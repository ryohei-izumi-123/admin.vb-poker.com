import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryDeleteComponent } from './inquiry-delete.component';

describe('InquiryDeleteComponent', () => {
  let component: InquiryDeleteComponent;
  let fixture: ComponentFixture<InquiryDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InquiryDeleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
