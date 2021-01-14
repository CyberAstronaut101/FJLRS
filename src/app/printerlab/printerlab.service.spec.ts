import { TestBed } from '@angular/core/testing';

import { PrinterlabService } from './printerlab.service';

describe('PrinterlabService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrinterlabService = TestBed.get(PrinterlabService);
    expect(service).toBeTruthy();
  });
});
