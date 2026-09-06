import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MediaService } from './media.service';
import { MediaItem } from '../models/media-item';

describe('MediaService', () => {
  let service: MediaService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(MediaService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should tag rows with the kind of the endpoint they came from', () => {
    let items: MediaItem[] | undefined;
    service.list().subscribe((value) => (items = value));

    http.expectOne('/api/movies/').flush([
      { id: 1, title: 'Seven Samurai', year: 1954, storage_unit_id: 3 },
    ]);
    http.expectOne('/api/series/').flush([
      { id: 1, title: 'The Wire', year: 2002, storage_unit_id: null },
    ]);

    expect(items).toEqual([
      { id: 1, kind: 'movie', title: 'Seven Samurai', year: 1954, storageUnitId: 3 },
      { id: 1, kind: 'series', title: 'The Wire', year: 2002, storageUnitId: null },
    ]);
  });

  it('should fail the whole listing when either endpoint fails', () => {
    let failed = false;
    service.list().subscribe({ error: () => (failed = true) });

    http.expectOne('/api/movies/').flush([]);
    http.expectOne('/api/series/').error(new ProgressEvent('failed'));

    expect(failed).toBeTrue();
  });

  it('should post a movie to the movies endpoint, in the shape the API speaks', () => {
    let created: MediaItem | undefined;
    service
      .create({ kind: 'movie', title: 'Seven Samurai', year: 1954, storageUnitId: 3 })
      .subscribe((value) => (created = value));

    const request = http.expectOne('/api/movies/');
    expect(request.request.method).toBe('POST');
    // snake_case on the wire, and the kind is not part of the payload.
    expect(request.request.body).toEqual({
      title: 'Seven Samurai',
      year: 1954,
      storage_unit_id: 3,
    });

    request.flush({ id: 9, title: 'Seven Samurai', year: 1954, storage_unit_id: 3 });

    expect(created).toEqual({
      id: 9,
      kind: 'movie',
      title: 'Seven Samurai',
      year: 1954,
      storageUnitId: 3,
    });
  });

  it('should post a series to the series endpoint', () => {
    let created: MediaItem | undefined;
    service
      .create({ kind: 'series', title: 'The Wire', year: null, storageUnitId: null })
      .subscribe((value) => (created = value));

    const request = http.expectOne('/api/series/');
    expect(request.request.body).toEqual({
      title: 'The Wire',
      year: null,
      storage_unit_id: null,
    });

    request.flush({ id: 4, title: 'The Wire', year: null, storage_unit_id: null });

    expect(created?.kind).toBe('series');
    expect(created?.id).toBe(4);
  });
});
