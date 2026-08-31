import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { StorageUnitsComponent } from './storage-units.component';

describe('StorageUnitsComponent', () => {
  let component: StorageUnitsComponent;
  let fixture: ComponentFixture<StorageUnitsComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageUnitsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(StorageUnitsComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => http.verify());

  it('should create', () => {
    http.expectOne('/api/storage_units/').flush([]);
    expect(component).toBeTruthy();
  });

  it('should show the empty shelf when there are no units', () => {
    http.expectOne('/api/storage_units/').flush([]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-empty-shelf')).toBeTruthy();
    expect(compiled.querySelector('app-storage-unit-list')).toBeFalsy();
  });

  it('should list the units once loaded', () => {
    http.expectOne('/api/storage_units/').flush([{ id: 1, name: 'Shelf A', capacity: 120 }]);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-storage-unit-list')).toBeTruthy();
    expect(compiled.querySelector('app-empty-shelf')).toBeFalsy();
  });

  it('should add a saved unit to the list, ordered by name', () => {
    http.expectOne('/api/storage_units/').flush([{ id: 1, name: 'Shelf A', capacity: 120 }]);

    component.add({ name: 'Box 2', capacity: 40 });
    http.expectOne('/api/storage_units/').flush({ id: 2, name: 'Box 2', capacity: 40 });

    expect(component.units().map((unit) => unit.name)).toEqual(['Box 2', 'Shelf A']);
    expect(component.saving()).toBeFalse();
  });

  it('should report a failed load and keep the retry available', () => {
    http.expectOne('/api/storage_units/').error(new ProgressEvent('failed'));
    fixture.detectChanges();

    expect(component.error()).toContain('could not be loaded');
    expect(component.loading()).toBeFalse();

    component.load();
    http.expectOne('/api/storage_units/').flush([]);
    expect(component.error()).toBeNull();
  });

  it('should name the unit that failed to save', () => {
    http.expectOne('/api/storage_units/').flush([]);

    component.add({ name: 'Box 2', capacity: 40 });
    http.expectOne('/api/storage_units/').error(new ProgressEvent('failed'));

    expect(component.error()).toContain('"Box 2"');
    expect(component.saving()).toBeFalse();
  });
});
