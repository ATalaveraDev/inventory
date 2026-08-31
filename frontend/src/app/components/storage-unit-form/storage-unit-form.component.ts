import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { StorageUnitCreate } from '../../models/storage-unit';

/**
 * Collects the fields for a new storage unit and validates them against the
 * same limits the API enforces. It emits a draft and nothing more — saving,
 * and whether saving worked, belong to whoever is listening.
 */
@Component({
  selector: 'app-storage-unit-form',
  imports: [ReactiveFormsModule],
  templateUrl: './storage-unit-form.component.html',
  styleUrl: './storage-unit-form.component.css'
})
export class StorageUnitFormComponent {
  /** Disables the control while the listener is saving. */
  readonly pending = input(false);

  readonly create = output<StorageUnitCreate>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    capacity: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  get name() { return this.form.controls.name; }
  get capacity() { return this.form.controls.capacity; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, capacity } = this.form.getRawValue();
    this.create.emit({ name: name.trim(), capacity: capacity as number });
  }

  /** Clears the fields. Called once the listener has saved the draft. */
  reset(): void {
    this.form.reset({ name: '', capacity: null });
  }
}
