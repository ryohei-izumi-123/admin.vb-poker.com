import { TestBed } from '@angular/core/testing';

import { LineLoginService } from './line-login.service';

describe('LineLoginService', () => {
  let service: LineLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LineLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
