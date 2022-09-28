import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpageUpdateComponent } from './webpage-update.component';

describe('WebpageUpdateComponent', () => {
  let component: WebpageUpdateComponent;
  let fixture: ComponentFixture<WebpageUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebpageUpdateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebpageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
