import { TestBed } from '@angular/core/testing';

import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocaleService = TestBed.inject(LocaleService);
    expect(service).toBeTruthy();
  });
});
