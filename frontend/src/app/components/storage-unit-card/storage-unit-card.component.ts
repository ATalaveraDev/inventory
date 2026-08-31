import { Component, input } from '@angular/core';

import { StorageUnit } from '../../models/storage-unit';

/** Renders one storage unit. Presentational only. */
@Component({
  selector: 'app-storage-unit-card',
  imports: [],
  templateUrl: './storage-unit-card.component.html',
  styleUrl: './storage-unit-card.component.css'
})
export class StorageUnitCardComponent {
  readonly unit = input.required<StorageUnit>();
}
