import { TestBed } from '@angular/core/testing';

import { ArcserverService } from './arcserver.service';

describe('ArcserverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArcserverService = TestBed.get(ArcserverService);
    expect(service).toBeTruthy();
  });
});
