import { TestBed } from '@angular/core/testing';

import { InquiryResolver } from './inquiry.resolver';

describe('InquiryResolver', () => {
  let resolver: InquiryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(InquiryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
