import { TestBed, inject } from '@angular/core/testing';

import { GeohashService } from './geohash.service';

describe('GeohashService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeohashService]
    });
  });

  it('should be created', inject([GeohashService], (service: GeohashService) => {
    expect(service).toBeTruthy();
  }));
});
