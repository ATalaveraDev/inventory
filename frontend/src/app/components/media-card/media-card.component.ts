import { Component, input } from '@angular/core';

import { MEDIA_KIND_LABELS, MediaItem } from '../../models/media-item';

/** Renders one movie or series. Presentational only. */
@Component({
  selector: 'app-media-card',
  imports: [],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.css'
})
export class MediaCardComponent {
  readonly item = input.required<MediaItem>();

  /**
   * The storage unit this title is filed on. Resolved by the caller, which is
   * the piece that holds both the titles and the units; the card only prints it.
   */
  readonly storageUnitName = input<string | null>(null);

  readonly kindLabels = MEDIA_KIND_LABELS;
}
