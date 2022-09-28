import { TestBed } from '@angular/core/testing';

import { DeviceDetectorService } from './device-detector.service';

describe('DeviceDetectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeviceDetectorService = TestBed.inject(
      DeviceDetectorService
    );
    expect(service).toBeTruthy();
  });
});
