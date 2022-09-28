import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpageDeleteComponent } from './webpage-delete.component';

describe('WebpageDeleteComponent', () => {
  let component: WebpageDeleteComponent;
  let fixture: ComponentFixture<WebpageDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebpageDeleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebpageDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
