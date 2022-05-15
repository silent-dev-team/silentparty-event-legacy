import { TestBed } from '@angular/core/testing';

import { SseHandlerService } from './sse-handler.service';

describe('SseHandlerService', () => {
  let service: SseHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SseHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
