import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPasswordComponent } from './customer-password.component';

describe('CustomerPasswordComponent', () => {
  let component: CustomerPasswordComponent;
  let fixture: ComponentFixture<CustomerPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerPasswordComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
