import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAddressAlertComponent } from './no-address-alert.component';

describe('NoAddressAlertComponent', () => {
  let component: NoAddressAlertComponent;
  let fixture: ComponentFixture<NoAddressAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoAddressAlertComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAddressAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
