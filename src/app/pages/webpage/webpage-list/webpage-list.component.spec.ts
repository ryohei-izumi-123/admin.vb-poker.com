import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebpageListComponent } from './webpage-list.component';

describe('WebpageListComponent', () => {
  let component: WebpageListComponent;
  let fixture: ComponentFixture<WebpageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebpageListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebpageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
