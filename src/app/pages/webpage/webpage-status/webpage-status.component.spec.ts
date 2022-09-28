import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpageStatusComponent } from './webpage-status.component';

describe('WebpageStatusComponent', () => {
  let component: WebpageStatusComponent;
  let fixture: ComponentFixture<WebpageStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebpageStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebpageStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
