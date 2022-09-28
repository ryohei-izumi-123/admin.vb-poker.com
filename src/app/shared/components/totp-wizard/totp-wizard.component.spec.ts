import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotpWizardComponent } from './totp-wizard.component';

describe('TotpWizardComponent', () => {
  let component: TotpWizardComponent;
  let fixture: ComponentFixture<TotpWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotpWizardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotpWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
