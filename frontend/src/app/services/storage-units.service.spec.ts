import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StorageUnitsService } from './storage-units.service';

describe('StorageUnitsService', () => {
  let service: StorageUnitsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StorageUnitsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the units from the API', () => {
    const units = [{ id: 1, name: 'Shelf A', capacity: 120 }];
    let received: unknown;

    service.list().subscribe((result) => (received = result));

    const request = http.expectOne('/api/storage_units/');
    expect(request.request.method).toBe('GET');
    request.flush(units);

    expect(received).toEqual(units);
  });

  it('should post a draft and return the saved unit', () => {
    const draft = { name: 'Box 2', capacity: 40 };
    let received: unknown;

    service.create(draft).subscribe((result) => (received = result));

    const request = http.expectOne('/api/storage_units/');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(draft);
    request.flush({ id: 2, ...draft });

    expect(received).toEqual({ id: 2, ...draft });
  });
});
