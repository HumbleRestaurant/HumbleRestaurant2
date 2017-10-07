import { TestBed, inject } from '@angular/core/testing';

import { FavService } from './fav.service';

describe('FavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavService]
    });
  });

  it('should be created', inject([FavService], (service: FavService) => {
    expect(service).toBeTruthy();
  }));
});
