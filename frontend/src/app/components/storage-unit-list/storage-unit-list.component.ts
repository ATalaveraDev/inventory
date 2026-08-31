import { Component, input } from '@angular/core';

import { StorageUnit } from '../../models/storage-unit';
import { StorageUnitCardComponent } from '../storage-unit-card/storage-unit-card.component';

/** Renders the storage units it is given, in the order it is given them. */
@Component({
  selector: 'app-storage-unit-list',
  imports: [StorageUnitCardComponent],
  templateUrl: './storage-unit-list.component.html',
  styleUrl: './storage-unit-list.component.css'
})
export class StorageUnitListComponent {
  readonly units = input.required<StorageUnit[]>();
}
