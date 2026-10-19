import { Component, DestroyRef, OnInit, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { MediaFormComponent } from '../../components/media-form/media-form.component';
import { MediaListComponent } from '../../components/media-list/media-list.component';
import { MediaItem, MediaItemCreate, MediaKind } from '../../models/media-item';
import { StorageUnit } from '../../models/storage-unit';
import { MediaService } from '../../services/media.service';
import { StorageUnitsService } from '../../services/storage-units.service';

@Component({
  selector: 'app-media-resource',
  imports: [MediaFormComponent, MediaListComponent],
  templateUrl: './media-resource.component.html',
  styleUrl: '../media-library/media-library.component.css',
})
export class MediaResourceComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly media = inject(MediaService);
  private readonly unitsService = inject(StorageUnitsService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly form = viewChild(MediaFormComponent);

  readonly kind = this.route.snapshot.data['kind'] as MediaKind;
  readonly label = this.route.snapshot.data['label'] as string;
  readonly items = signal<MediaItem[]>([]);
  readonly storageUnits = signal<StorageUnit[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly unitsError = signal<string | null>(null);
  readonly saveError = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
    this.loadUnits();
  }

  load(): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.loadError.set(null);
    this.media.listOf(this.kind).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (items) => {
        this.items.set(items.sort((a, b) => a.title.localeCompare(b.title)));
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(`${this.label} could not be loaded. Please try again.`);
        this.loading.set(false);
      },
    });
  }

  loadUnits(): void {
    this.unitsError.set(null);
    this.unitsService.list().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (units) => this.storageUnits.set(units),
      error: () => this.unitsError.set('Storage units could not be loaded. You can still add an unfiled title.'),
    });
  }

  add(draft: MediaItemCreate): void {
    if (this.saving() || this.loading()) return;
    this.saving.set(true);
    this.saveError.set(null);
    this.media.create({ ...draft, kind: this.kind }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (created) => {
        this.items.update((items) => [...items, created].sort((a, b) => a.title.localeCompare(b.title)));
        this.saving.set(false);
        this.form()?.reset();
      },
      error: () => {
        this.saveError.set(`"${draft.title}" was not saved. Your details are still in the form; please try again.`);
        this.saving.set(false);
      },
    });
  }
}
