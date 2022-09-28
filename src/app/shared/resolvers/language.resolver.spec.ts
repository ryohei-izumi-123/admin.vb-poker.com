import { TestBed } from '@angular/core/testing';

import { LanguageResolver } from './language.resolver';

describe('LanguageResolver', () => {
  let resolver: LanguageResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(LanguageResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
