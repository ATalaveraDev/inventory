import { Component, OnInit, inject, signal, viewChild } from '@angular/core';

import { EmptyShelfComponent } from '../../components/empty-shelf/empty-shelf.component';
import { StorageUnitFormComponent } from '../../components/storage-unit-form/storage-unit-form.component';
import { StorageUnitListComponent } from '../../components/storage-unit-list/storage-unit-list.component';
import { StorageUnit, StorageUnitCreate } from '../../models/storage-unit';
import { StorageUnitsService } from '../../services/storage-units.service';

/**
 * Owns the storage units on screen: loads them, adds to them, and decides
 * which state to show. The pieces it composes stay presentational.
 */
@Component({
  selector: 'app-storage-units',
  imports: [StorageUnitFormComponent, StorageUnitListComponent, EmptyShelfComponent],
  templateUrl: './storage-units.component.html',
  styleUrl: './storage-units.component.css'
})
export class StorageUnitsComponent implements OnInit {
  private readonly storageUnits = inject(StorageUnitsService);
  private readonly form = viewChild(StorageUnitFormComponent);

  readonly units = signal<StorageUnit[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.storageUnits.list().subscribe({
      next: (units) => {
        this.units.set(units);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('The storage units could not be loaded. Check that the API is running, then retry.');
        this.loading.set(false);
      },
    });
  }

  add(draft: StorageUnitCreate): void {
    this.saving.set(true);
    this.error.set(null);

    this.storageUnits.create(draft).subscribe({
      next: (created) => {
        // Kept in the same order the API lists them in, by name.
        this.units.update((units) =>
          [...units, created].sort((a, b) => a.name.localeCompare(b.name))
        );
        this.saving.set(false);
        this.form()?.reset();
      },
      error: () => {
        this.error.set(`"${draft.name}" was not saved. Check that the API is running, then try again.`);
        this.saving.set(false);
      },
    });
  }
}
