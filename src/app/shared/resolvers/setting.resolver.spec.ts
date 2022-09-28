import { TestBed } from '@angular/core/testing';

import { SettingResolver } from './setting.resolver';

describe('SettingResolver', () => {
  let resolver: SettingResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SettingResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
