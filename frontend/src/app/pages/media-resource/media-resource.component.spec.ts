import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';

describe('Resource pages', () => {
  let http: HttpTestingController;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => http.verify());

  function input(selector: string, value: string): void {
    const field = harness.routeNativeElement!.querySelector(selector) as HTMLInputElement;
    field.value = value;
    field.dispatchEvent(new Event('input'));
    harness.detectChanges();
  }

  function submit(): void {
    harness.routeNativeElement!.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    harness.detectChanges();
  }

  for (const resource of ['games', 'movies', 'series']) {
    it(`lists and creates ${resource} through its own route and API`, async () => {
      await harness.navigateByUrl(`/${resource}`);
      http.expectOne('/api/storage_units/').flush([{ id: 3, name: 'Shelf A', capacity: 20 }]);
      http.expectOne(`/api/${resource}/`).flush([
        { id: 1, title: 'Z title', year: 2000, storage_unit_id: 3, ...(resource === 'games' ? { platform: 'PC' } : {}) },
      ]);
      harness.detectChanges();
      expect(harness.routeNativeElement!.textContent).toContain('Z title');
      expect(harness.routeNativeElement!.textContent).toContain('Shelf A');
      expect(harness.routeNativeElement!.querySelector('.kind')).toBeNull();
      input('#media-title', '  A title  ');
      if (resource === 'games') input('#game-platform', '  PC  ');
      submit();
      const request = http.expectOne(`/api/${resource}/`);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({ title: 'A title', year: null, storage_unit_id: null,
        ...(resource === 'games' ? { platform: 'PC' } : {}) });
      expect((harness.routeNativeElement!.querySelector('.submit') as HTMLButtonElement).disabled).toBeTrue();
      request.flush({ id: 2, ...request.request.body });
      harness.detectChanges();
      const titles = harness.routeNativeElement!.querySelectorAll('.card__title');
      expect(Array.from(titles).map((title) => title.textContent)).toEqual(['A title', 'Z title']);
      expect((harness.routeNativeElement!.querySelector('#media-title') as HTMLInputElement).value).toBe('');
      if (resource === 'games') expect(harness.routeNativeElement!.textContent).toContain('PC');
    });
  }

  it('requires a game platform and preserves the draft after a failed save', async () => {
    await harness.navigateByUrl('/games');
    http.expectOne('/api/storage_units/').flush([]);
    http.expectOne('/api/games/').flush([]);
    harness.detectChanges();
    input('#media-title', 'Portal');
    input('#game-platform', '   ');
    submit();
    http.expectNone('/api/games/');
    expect(harness.routeNativeElement!.querySelector('#game-platform-error')).toBeTruthy();
    input('#game-platform', 'PC');
    submit();
    http.expectOne('/api/games/').flush({}, { status: 500, statusText: 'Failed' });
    harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('was not saved');
    expect((harness.routeNativeElement!.querySelector('#media-title') as HTMLInputElement).value).toBe('Portal');
    submit();
    http.expectOne('/api/games/').flush({ id: 1, title: 'Portal', year: null, platform: 'PC', storage_unit_id: null });
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('.card__title')!.textContent).toBe('Portal');
  });

  it('retries failed loads and changes resources when navigating', async () => {
    await harness.navigateByUrl('/movies');
    http.expectOne('/api/storage_units/').flush([]);
    http.expectOne('/api/movies/').flush({}, { status: 500, statusText: 'Failed' });
    harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('Movies could not be loaded');
    (harness.routeNativeElement!.querySelector('.retry') as HTMLButtonElement).click();
    http.expectOne('/api/movies/').flush([]);
    harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('No movies yet');
    await harness.navigateByUrl('/series');
    http.expectOne('/api/storage_units/').flush([]);
    http.expectOne('/api/series/').flush([]);
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('h1')!.textContent).toBe('Series');
    expect(harness.routeNativeElement!.textContent).toContain('No series yet');
  });

  it('keeps the list usable when storage units fail to load', async () => {
    await harness.navigateByUrl('/games');
    http.expectOne('/api/storage_units/').flush({}, { status: 500, statusText: 'Failed' });
    http.expectOne('/api/games/').flush([{ id: 1, title: 'Portal', platform: 'PC', year: null, storage_unit_id: null }]);
    harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('Storage units could not be loaded');
    expect(harness.routeNativeElement!.querySelector('.card__title')!.textContent).toBe('Portal');
  });

  it('lists and creates storage units on its own page', async () => {
    await harness.navigateByUrl('/storage-units');
    http.expectOne('/api/storage_units/').flush([]);
    harness.detectChanges();
    const fields = harness.routeNativeElement!.querySelectorAll('input');
    for (const field of Array.from(fields)) {
      field.value = field.type === 'number' ? '20' : 'Shelf A';
      field.dispatchEvent(new Event('input'));
    }
    submit();
    const request = http.expectOne('/api/storage_units/');
    expect(request.request.body).toEqual({ name: 'Shelf A', capacity: 20 });
    request.flush({ id: 1, name: 'Shelf A', capacity: 20 });
    harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('Shelf A');
  });
});
