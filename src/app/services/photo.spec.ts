import { TestBed } from '@angular/core/testing';

import { Photo } from './photo.service';

describe('Photo', () => {
  let service: Photo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Photo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
