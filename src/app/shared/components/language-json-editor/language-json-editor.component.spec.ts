import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageJsonEditorComponent } from './language-json-editor.component';

describe('LanguageJsonEditorComponent', () => {
  let component: LanguageJsonEditorComponent;
  let fixture: ComponentFixture<LanguageJsonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanguageJsonEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageJsonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
