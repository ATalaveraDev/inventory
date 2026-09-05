import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaListComponent } from './media-list.component';
import { MediaItem } from '../../models/media-item';

// Movies and series are numbered independently, so both can be id 1 at once.
const ITEMS: MediaItem[] = [
  { id: 1, kind: 'movie', title: 'Seven Samurai', year: 1954, storageUnitId: 3 },
  { id: 1, kind: 'series', title: 'The Wire', year: 2002, storageUnitId: null },
];

describe('MediaListComponent', () => {
  let fixture: ComponentFixture<MediaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaListComponent);
    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render one card per title, keeping the given order', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const titles = Array.from(compiled.querySelectorAll('.card__title'))
      .map((node) => node.textContent?.trim());
    expect(titles).toEqual(['Seven Samurai', 'The Wire']);
  });

  it('should resolve the storage unit a title is filed on', () => {
    fixture.componentRef.setInput('storageUnits', [{ id: 3, name: 'Shelf A', capacity: 120 }]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Shelf A');
    // The series is filed on nothing at all.
    expect(compiled.textContent).toContain('Unfiled');
  });

  it('should fall back to unfiled when the unit is not among those given', () => {
    fixture.componentRef.setInput('storageUnits', [{ id: 99, name: 'Box 2', capacity: 40 }]);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).not.toContain('Box 2');
  });
});
