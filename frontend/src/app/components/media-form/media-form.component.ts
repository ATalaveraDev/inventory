import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MediaItemCreate, MediaKind } from '../../models/media-item';
import { StorageUnit } from '../../models/storage-unit';

/** The first year a film was projected; anything earlier is a typo. */
const FIRST_FILM_YEAR = 1888;

/**
 * Collects the fields for a new movie or series and validates them against the
 * same limits the API enforces. It emits a draft and nothing more — saving, and
 * whether saving worked, belong to whoever is listening.
 */
@Component({
  selector: 'app-media-form',
  imports: [ReactiveFormsModule],
  templateUrl: './media-form.component.html',
  styleUrl: './media-form.component.css'
})
export class MediaFormComponent {
  /** Disables the controls while the listener is saving. */
  readonly pending = input(false);
  readonly fixedKind = input<MediaKind | null>(null);
  readonly platform = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] });

  /** The units a title can be filed on. Filing is optional, as in the API. */
  readonly storageUnits = input<StorageUnit[]>([]);

  readonly create = output<MediaItemCreate>();

  private readonly fb = inject(FormBuilder);

  readonly minYear = FIRST_FILM_YEAR;
  readonly maxYear = new Date().getFullYear() + 5;

  readonly form = this.fb.nonNullable.group({
    kind: ['movie' as MediaKind, Validators.required],
    title: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    year: [
      null as number | null,
      [Validators.min(FIRST_FILM_YEAR), Validators.max(this.maxYear), Validators.pattern(/^\d+$/)],
    ],
    storageUnitId: [null as number | null],
  });

  get kind() { return this.form.controls.kind; }
  get title() { return this.form.controls.title; }
  get year() { return this.form.controls.year; }

  submit(): void {
    if (this.pending()) return;
    if (this.form.invalid || (this.fixedKind() === 'game' && this.platform.invalid)) {
      this.form.markAllAsTouched();
      this.platform.markAsTouched();
      return;
    }

    const { kind, title, year, storageUnitId } = this.form.getRawValue();
    this.create.emit({
      kind: this.fixedKind() ?? kind,
      title: title.trim(),
      year: year ?? null,
      storageUnitId,
      ...(this.fixedKind() === 'game' ? { platform: this.platform.value.trim() } : {}),
    });
  }

  /** Clears the fields. Called once the listener has saved the draft. */
  reset(): void {
    this.form.reset({ kind: 'movie', title: '', year: null, storageUnitId: null });
    this.platform.reset();
  }
}
