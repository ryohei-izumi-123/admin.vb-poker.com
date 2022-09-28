import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryUpdateComponent } from './inquiry-update.component';

describe('InquiryUpdateComponent', () => {
  let component: InquiryUpdateComponent;
  let fixture: ComponentFixture<InquiryUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InquiryUpdateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
