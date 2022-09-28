import { TestBed } from '@angular/core/testing';

import { AclResolver } from './acl.resolver';

describe('AclResolver', () => {
  let resolver: AclResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AclResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
