import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MediaLibraryComponent } from './media-library.component';
import { MediaItem } from '../../models/media-item';
import { StorageUnit } from '../../models/storage-unit';

const ITEMS: MediaItem[] = [
  { id: 1, kind: 'movie', title: 'Seven Samurai', year: 1954, storageUnitId: 3 },
  { id: 1, kind: 'series', title: 'The Wire', year: 2002, storageUnitId: null },
];

const UNITS: StorageUnit[] = [
  { id: 3, name: 'Shelf A', capacity: 120 },
  { id: 7, name: 'Box 2', capacity: 40 },
];

describe('MediaLibraryComponent', () => {
  let component: MediaLibraryComponent;
  let fixture: ComponentFixture<MediaLibraryComponent>;
  let http: HttpTestingController;

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
    http.expectOne('/api/storage_units/').flush([]);
    expect(component).toBeTruthy();
  });

  it('should open on the empty library, showing every kind', () => {
    http.expectOne('/api/storage_units/').flush([]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(component.filter()).toBe('all');
    expect(compiled.querySelector('app-empty-library')).toBeTruthy();
    expect(compiled.querySelector('app-media-list')).toBeFalsy();
  });

  it('should offer the loaded storage units to the form', () => {
    http.expectOne('/api/storage_units/').flush(UNITS);
    fixture.detectChanges();

    expect(component.storageUnits()).toEqual(UNITS);

    const options = (fixture.nativeElement as HTMLElement).querySelectorAll('option');
    expect(Array.from(options).map((option) => option.textContent?.trim()))
      .toEqual(['Unfiled', 'Shelf A', 'Box 2']);
  });

  it('should stay usable when the storage units fail to load', () => {
    http.expectOne('/api/storage_units/').error(new ProgressEvent('failed'));
    fixture.detectChanges();

    expect(component.storageUnits()).toEqual([]);
    expect(component.error()).toContain('storage units could not be loaded');

    // Filing is optional, so the form still offers the one choice it can.
    const options = (fixture.nativeElement as HTMLElement).querySelectorAll('option');
    expect(Array.from(options).map((option) => option.textContent?.trim())).toEqual(['Unfiled']);
  });

  it('should fetch the storage units again on retry', () => {
    http.expectOne('/api/storage_units/').error(new ProgressEvent('failed'));
    fixture.detectChanges();

    const retry = (fixture.nativeElement as HTMLElement)
      .querySelector('.retry') as HTMLButtonElement;
    retry.click();

    http.expectOne('/api/storage_units/').flush(UNITS);
    expect(component.error()).toBeNull();
    expect(component.storageUnits()).toEqual(UNITS);
  });

  it('should list the titles it holds', () => {
    http.expectOne('/api/storage_units/').flush([]);
    component.items.set(ITEMS);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-media-list')).toBeTruthy();
    expect(compiled.querySelector('app-empty-library')).toBeFalsy();
  });

  it('should show only the chosen kind', () => {
    http.expectOne('/api/storage_units/').flush([]);
    component.items.set(ITEMS);

    component.show('series');

    expect(component.visibleItems().map((item) => item.title)).toEqual(['The Wire']);
  });

  it('should tell an empty library apart from an empty filter', () => {
    http.expectOne('/api/storage_units/').flush([]);
    expect(component.filteredToNothing()).toBeFalse();

    component.items.set([ITEMS[0]]);
    component.show('series');

    expect(component.visibleItems()).toEqual([]);
    expect(component.filteredToNothing()).toBeTrue();
  });

  it('should count what is shown against what is held', () => {
    http.expectOne('/api/storage_units/').flush([]);
    component.items.set(ITEMS);
    component.show('movie');
    fixture.detectChanges();

    const count = (fixture.nativeElement as HTMLElement).querySelector('.count');
    expect(count?.textContent).toContain('1 of 2');
  });

  it('should name the unit a listed title is filed on', () => {
    http.expectOne('/api/storage_units/').flush(UNITS);
    component.items.set(ITEMS);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Shelf A');
  });
});
