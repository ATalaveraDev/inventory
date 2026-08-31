import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageUnitFormComponent } from './storage-unit-form.component';
import { StorageUnitCreate } from '../../models/storage-unit';

describe('StorageUnitFormComponent', () => {
  let component: StorageUnitFormComponent;
  let fixture: ComponentFixture<StorageUnitFormComponent>;
  let emitted: StorageUnitCreate[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageUnitFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StorageUnitFormComponent);
    component = fixture.componentInstance;
    emitted = [];
    component.create.subscribe((draft) => emitted.push(draft));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not emit while the form is empty', () => {
    component.submit();
    expect(emitted).toEqual([]);
  });

  it('should show what to fix once submitted empty', () => {
    component.submit();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.field__error').length).toBe(2);
  });

  it('should reject a name over 50 characters', () => {
    component.form.setValue({ name: 'x'.repeat(51), capacity: 10 });
    component.submit();
    expect(emitted).toEqual([]);
  });

  it('should emit a trimmed draft when valid', () => {
    component.form.setValue({ name: '  Shelf A  ', capacity: 120 });
    component.submit();
    expect(emitted).toEqual([{ name: 'Shelf A', capacity: 120 }]);
  });

  it('should clear the fields on reset', () => {
    component.form.setValue({ name: 'Shelf A', capacity: 120 });
    component.reset();
    expect(component.form.getRawValue()).toEqual({ name: '', capacity: null });
  });
});
