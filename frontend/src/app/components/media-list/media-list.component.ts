import { Component, computed, input } from '@angular/core';

import { MediaItem } from '../../models/media-item';
import { StorageUnit } from '../../models/storage-unit';
import { MediaCardComponent } from '../media-card/media-card.component';

/** Renders the titles it is given, in the order it is given them. */
@Component({
  selector: 'app-media-list',
  imports: [MediaCardComponent],
  templateUrl: './media-list.component.html',
  styleUrl: './media-list.component.css'
})
export class MediaListComponent {
  readonly items = input.required<MediaItem[]>();

  /** Used to print the unit a title is filed on rather than its bare id. */
  readonly storageUnits = input<StorageUnit[]>([]);

  private readonly unitNames = computed(
    () => new Map(this.storageUnits().map((unit) => [unit.id, unit.name]))
  );

  storageUnitName(item: MediaItem): string | null {
    const id = item.storageUnitId;
    return id === null ? null : this.unitNames().get(id) ?? null;
  }
}
