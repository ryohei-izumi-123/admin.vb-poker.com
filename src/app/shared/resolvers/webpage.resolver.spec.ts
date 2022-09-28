import { TestBed } from '@angular/core/testing';

import { WebpageResolver } from './webpage.resolver';

describe('WebpageResolver', () => {
  let resolver: WebpageResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(WebpageResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
