import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';

import { EmptyLibraryComponent } from '../../components/empty-library/empty-library.component';
import { MediaFilterComponent } from '../../components/media-filter/media-filter.component';
import { MediaFormComponent } from '../../components/media-form/media-form.component';
import { MediaListComponent } from '../../components/media-list/media-list.component';
import { MediaFilter, MediaItem, MediaItemCreate } from '../../models/media-item';
import { StorageUnit } from '../../models/storage-unit';
import { StorageUnitsService } from '../../services/storage-units.service';

/**
 * Owns the movies and series on screen: holds them, adds to them, and decides
 * which state to show. The pieces it composes stay presentational.
 *
 * Loading and saving titles are stubbed below and wired in a later iteration;
 * the API exposes no way to read them yet.
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
  private readonly storageUnitsService = inject(StorageUnitsService);
  protected readonly form = viewChild(MediaFormComponent);

  readonly items = signal<MediaItem[]>([]);
  readonly storageUnits = signal<StorageUnit[]>([]);
  readonly filter = signal<MediaFilter>('all');
  readonly loading = signal(false);
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

  /**
   * TODO(next iteration): load the titles themselves, mirroring
   * StorageUnitsComponent.load(). Needs GET /api/movies/ and GET /api/series/,
   * neither of which the API exposes yet.
   */
  load(): void {
    // Intentionally empty until those endpoints exist.
  }

  show(filter: MediaFilter): void {
    this.filter.set(filter);
  }

  /**
   * TODO(next iteration): POST the draft to /api/movies/ or /api/series/ by its
   * kind, append the saved title, then call `this.form()?.reset()`.
   */
  add(draft: MediaItemCreate): void {
    void draft;
  }
}
