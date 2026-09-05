import { Component, input, output } from '@angular/core';

import { MediaFilter } from '../../models/media-item';

interface FilterOption {
  readonly value: MediaFilter;
  readonly label: string;
}

/**
 * Chooses which kinds the library shows. It reports the choice and holds no
 * opinion about the titles themselves — the filtering happens upstream.
 */
@Component({
  selector: 'app-media-filter',
  imports: [],
  templateUrl: './media-filter.component.html',
  styleUrl: './media-filter.component.css'
})
export class MediaFilterComponent {
  readonly selected = input.required<MediaFilter>();

  readonly selectedChange = output<MediaFilter>();

  readonly options: readonly FilterOption[] = [
    { value: 'all', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'series', label: 'Series' },
  ];

  select(value: MediaFilter): void {
    if (value !== this.selected()) {
      this.selectedChange.emit(value);
    }
  }
}
