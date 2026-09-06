import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';

import { EmptyLibraryComponent } from '../../components/empty-library/empty-library.component';
import { MediaFilterComponent } from '../../components/media-filter/media-filter.component';
import { MediaFormComponent } from '../../components/media-form/media-form.component';
import { MediaListComponent } from '../../components/media-list/media-list.component';
import { MediaFilter, MediaItem, MediaItemCreate } from '../../models/media-item';
import { StorageUnit } from '../../models/storage-unit';
import { MediaService } from '../../services/media.service';
import { StorageUnitsService } from '../../services/storage-units.service';

/** The order both APIs list their rows in, kept as titles are added. */
function byTitle(a: MediaItem, b: MediaItem): number {
  return a.title.localeCompare(b.title);
}

/**
 * Owns the movies and series on screen: loads them, adds to them, and decides
 * which state to show. The pieces it composes stay presentational.
 */
@Component({
  selector: 'app-media-library',
  imports: [
    MediaFormComponent,
    MediaFilterComponent,
    MediaListComponent,
    EmptyLibraryComponent,
  ],
  templateUrl: './media-library.component.html',
  styleUrl: './media-library.component.css'
})
export class MediaLibraryComponent implements OnInit {
  private readonly media = inject(MediaService);
  private readonly storageUnitsService = inject(StorageUnitsService);
  protected readonly form = viewChild(MediaFormComponent);

  readonly items = signal<MediaItem[]>([]);
  readonly storageUnits = signal<StorageUnit[]>([]);
  readonly filter = signal<MediaFilter>('all');
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  /** What the list renders: the titles the current filter lets through. */
  readonly visibleItems = computed(() => {
    const filter = this.filter();
    return filter === 'all'
      ? this.items()
      : this.items().filter((item) => item.kind === filter);
  });

  /** Tells the two empty states apart: nothing here yet, or nothing shown. */
  readonly filteredToNothing = computed(
    () => this.items().length > 0 && this.visibleItems().length === 0
  );

  ngOnInit(): void {
    this.reload();
  }

  /** Fetches everything the page needs. Also what the error banner retries. */
  reload(): void {
    this.error.set(null);
    this.loadStorageUnits();
    this.load();
  }

  load(): void {
    this.loading.set(true);

    this.media.list().subscribe({
      next: (items) => {
        this.items.set([...items].sort(byTitle));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('The titles could not be loaded. Check that the API is running, then retry.');
        this.loading.set(false);
      },
    });
  }

  show(filter: MediaFilter): void {
    this.filter.set(filter);
  }

  add(draft: MediaItemCreate): void {
    this.saving.set(true);
    this.error.set(null);

    this.media.create(draft).subscribe({
      next: (created) => {
        // Kept in the same order both APIs list them in, by title.
        this.items.update((items) => [...items, created].sort(byTitle));
        this.reveal(created);
        this.saving.set(false);
        this.form()?.reset();
      },
      error: () => {
        this.error.set(`"${draft.title}" was not saved. Check that the API is running, then try again.`);
        this.saving.set(false);
      },
    });
  }

  /**
   * A title saved while the other kind is on screen would land outside the
   * filter and read as a silent failure, so widen the filter to show it.
   */
  private reveal(item: MediaItem): void {
    if (this.filter() !== 'all' && this.filter() !== item.kind) {
      this.filter.set('all');
    }
  }

  /**
   * The units a title can be filed on. They are only ever offered as a choice,
   * so failing to load them leaves the page usable: the form falls back to
   * filing nothing, which is what the API does with a missing storage unit.
   */
  private loadStorageUnits(): void {
    this.storageUnitsService.list().subscribe({
      next: (units) => this.storageUnits.set(units),
      error: () => {
        this.storageUnits.set([]);
        this.error.set(
          'The storage units could not be loaded, so a title cannot be filed on one yet. Check that the API is running, then retry.'
        );
      },
    });
  }
}
