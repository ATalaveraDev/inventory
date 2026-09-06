import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MediaLibraryComponent } from './media-library.component';
import { StorageUnit } from '../../models/storage-unit';

const UNITS: StorageUnit[] = [
  { id: 3, name: 'Shelf A', capacity: 120 },
  { id: 7, name: 'Box 2', capacity: 40 },
];

const MOVIE_ROWS = [{ id: 1, title: 'Seven Samurai', year: 1954, storage_unit_id: 3 }];
const SERIES_ROWS = [{ id: 1, title: 'The Wire', year: 2002, storage_unit_id: null }];

describe('MediaLibraryComponent', () => {
  let component: MediaLibraryComponent;
  let fixture: ComponentFixture<MediaLibraryComponent>;
  let http: HttpTestingController;

  /** Answers the three requests the page makes when it opens. */
  function settle(options: {
    units?: StorageUnit[];
    movies?: unknown[];
    series?: unknown[];
  } = {}): void {
    http.expectOne('/api/storage_units/').flush(options.units ?? []);
    http.expectOne('/api/movies/').flush(options.movies ?? []);
    http.expectOne('/api/series/').flush(options.series ?? []);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaLibraryComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaLibraryComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    settle();
    expect(component).toBeTruthy();
  });

  it('should open on the empty library, showing every kind', () => {
    settle();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.filter()).toBe('all');
    expect(compiled.querySelector('app-empty-library')).toBeTruthy();
    expect(compiled.querySelector('app-media-list')).toBeFalsy();
  });

  it('should hold both kinds in one list, ordered by title', () => {
    settle({ movies: MOVIE_ROWS, series: SERIES_ROWS });

    expect(component.items().map((item) => item.title)).toEqual(['Seven Samurai', 'The Wire']);
    expect(component.items().map((item) => item.kind)).toEqual(['movie', 'series']);
    expect((fixture.nativeElement as HTMLElement).querySelector('app-media-list')).toBeTruthy();
  });

  it('should offer the loaded storage units to the form', () => {
    settle({ units: UNITS });

    const options = (fixture.nativeElement as HTMLElement).querySelectorAll('option');
    expect(Array.from(options).map((option) => option.textContent?.trim()))
      .toEqual(['Unfiled', 'Shelf A', 'Box 2']);
  });

  it('should show only the chosen kind', () => {
    settle({ movies: MOVIE_ROWS, series: SERIES_ROWS });

    component.show('series');

    expect(component.visibleItems().map((item) => item.title)).toEqual(['The Wire']);
  });

  it('should post a new movie and list it in title order', () => {
    settle({ movies: MOVIE_ROWS });

    component.add({ kind: 'movie', title: 'Rashomon', year: 1950, storageUnitId: 3 });

    const request = http.expectOne('/api/movies/');
    expect(request.request.body).toEqual({ title: 'Rashomon', year: 1950, storage_unit_id: 3 });
    request.flush({ id: 2, title: 'Rashomon', year: 1950, storage_unit_id: 3 });

    expect(component.items().map((item) => item.title)).toEqual(['Rashomon', 'Seven Samurai']);
    expect(component.saving()).toBeFalse();
  });

  it('should post a new series to the series endpoint', () => {
    settle();

    component.add({ kind: 'series', title: 'The Wire', year: 2002, storageUnitId: null });

    http.expectOne('/api/series/')
      .flush({ id: 1, title: 'The Wire', year: 2002, storage_unit_id: null });

    expect(component.items().map((item) => item.kind)).toEqual(['series']);
  });

  it('should clear the form once the title is saved', () => {
    settle();

    const form = (fixture.nativeElement as HTMLElement)
      .querySelector('#media-title') as HTMLInputElement;
    form.value = 'Rashomon';
    form.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    component.add({ kind: 'movie', title: 'Rashomon', year: null, storageUnitId: null });
    http.expectOne('/api/movies/')
      .flush({ id: 2, title: 'Rashomon', year: null, storage_unit_id: null });
    fixture.detectChanges();

    expect(form.value).toBe('');
  });

  it('should widen the filter so a saved title is not hidden by it', () => {
    settle({ movies: MOVIE_ROWS });
    component.show('movie');

    component.add({ kind: 'series', title: 'The Wire', year: 2002, storageUnitId: null });
    http.expectOne('/api/series/')
      .flush({ id: 1, title: 'The Wire', year: 2002, storage_unit_id: null });

    expect(component.filter()).toBe('all');
    expect(component.visibleItems().length).toBe(2);
  });

  it('should leave the filter alone when the saved title is already shown', () => {
    settle({ movies: MOVIE_ROWS });
    component.show('movie');

    component.add({ kind: 'movie', title: 'Rashomon', year: null, storageUnitId: null });
    http.expectOne('/api/movies/')
      .flush({ id: 2, title: 'Rashomon', year: null, storage_unit_id: null });

    expect(component.filter()).toBe('movie');
  });

  it('should name the title that failed to save', () => {
    settle();

    component.add({ kind: 'movie', title: 'Rashomon', year: null, storageUnitId: null });
    http.expectOne('/api/movies/').error(new ProgressEvent('failed'));

    expect(component.error()).toContain('"Rashomon"');
    expect(component.saving()).toBeFalse();
    expect(component.items()).toEqual([]);
  });

  it('should report a failed load and keep the retry available', () => {
    http.expectOne('/api/storage_units/').flush([]);
    http.expectOne('/api/movies/').flush([]);
    http.expectOne('/api/series/').error(new ProgressEvent('failed'));
    fixture.detectChanges();

    expect(component.error()).toContain('titles could not be loaded');
    expect(component.loading()).toBeFalse();

    const retry = (fixture.nativeElement as HTMLElement)
      .querySelector('.retry') as HTMLButtonElement;
    retry.click();

    settle({ units: UNITS, movies: MOVIE_ROWS });
    expect(component.error()).toBeNull();
    expect(component.items().length).toBe(1);
  });

  it('should stay usable when only the storage units fail to load', () => {
    http.expectOne('/api/storage_units/').error(new ProgressEvent('failed'));
    http.expectOne('/api/movies/').flush(MOVIE_ROWS);
    http.expectOne('/api/series/').flush([]);
    fixture.detectChanges();

    expect(component.storageUnits()).toEqual([]);
    expect(component.error()).toContain('storage units could not be loaded');
    // The titles still arrived, so the list is there to use.
    expect(component.items().length).toBe(1);
  });

  it('should tell an empty library apart from an empty filter', () => {
    settle({ movies: MOVIE_ROWS });
    expect(component.filteredToNothing()).toBeFalse();

    component.show('series');

    expect(component.visibleItems()).toEqual([]);
    expect(component.filteredToNothing()).toBeTrue();
  });

  it('should count what is shown against what is held', () => {
    settle({ movies: MOVIE_ROWS, series: SERIES_ROWS });
    component.show('movie');
    fixture.detectChanges();

    const count = (fixture.nativeElement as HTMLElement).querySelector('.count');
    expect(count?.textContent).toContain('1 of 2');
  });
});
