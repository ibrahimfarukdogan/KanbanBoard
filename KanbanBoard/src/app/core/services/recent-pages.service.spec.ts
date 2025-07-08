import { TestBed } from '@angular/core/testing';

import { RecentPagesService } from './recent-pages.service';

describe('RecentPagesService', () => {
  let service: RecentPagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecentPagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
