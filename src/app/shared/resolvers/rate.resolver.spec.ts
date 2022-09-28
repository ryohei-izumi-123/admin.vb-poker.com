import { TestBed } from '@angular/core/testing';

import { RateResolver } from './rate.resolver';

describe('RateResolver', () => {
  let resolver: RateResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RateResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
