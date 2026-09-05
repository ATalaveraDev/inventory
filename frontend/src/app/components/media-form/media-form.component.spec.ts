import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaFormComponent } from './media-form.component';
import { MediaItemCreate } from '../../models/media-item';

describe('MediaFormComponent', () => {
  let component: MediaFormComponent;
  let fixture: ComponentFixture<MediaFormComponent>;
  let drafts: MediaItemCreate[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaFormComponent);
    component = fixture.componentInstance;
    drafts = [];
    component.create.subscribe((draft) => drafts.push(draft));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start on a movie, unfiled and without a year', () => {
    expect(component.form.getRawValue()).toEqual({
      kind: 'movie',
      title: '',
      year: null,
      storageUnitId: null,
    });
  });

  it('should emit a trimmed draft', () => {
    component.form.setValue({
      kind: 'series',
      title: '  The Wire  ',
      year: 2002,
      storageUnitId: 3,
    });

    component.submit();

    expect(drafts).toEqual([
      { kind: 'series', title: 'The Wire', year: 2002, storageUnitId: 3 },
    ]);
  });

  it('should treat the year and the storage unit as optional', () => {
    component.form.patchValue({ title: 'Seven Samurai' });

    component.submit();

    expect(drafts).toEqual([
      { kind: 'movie', title: 'Seven Samurai', year: null, storageUnitId: null },
    ]);
  });

  it('should refuse a draft without a title and show why', () => {
    component.submit();

    expect(drafts).toEqual([]);
    expect(component.title.touched).toBeTrue();

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#media-title-error')).toBeTruthy();
  });

  it('should refuse a year outside the range it accepts', () => {
    component.form.patchValue({ title: 'Le Voyage dans la Lune', year: 1800 });

    component.submit();

    expect(drafts).toEqual([]);
    expect(component.year.invalid).toBeTrue();
  });

  it('should list the storage units it is given', () => {
    fixture.componentRef.setInput('storageUnits', [{ id: 3, name: 'Shelf A', capacity: 120 }]);
    fixture.detectChanges();

    const options = (fixture.nativeElement as HTMLElement).querySelectorAll('option');
    expect(Array.from(options).map((option) => option.textContent?.trim()))
      .toEqual(['Unfiled', 'Shelf A']);
  });

  it('should disable the control while the listener is saving', () => {
    fixture.componentRef.setInput('pending', true);
    fixture.detectChanges();

    const submit = (fixture.nativeElement as HTMLElement)
      .querySelector('.submit') as HTMLButtonElement;
    expect(submit.disabled).toBeTrue();
  });

  it('should clear back to the starting values on reset', () => {
    component.form.setValue({
      kind: 'series',
      title: 'The Wire',
      year: 2002,
      storageUnitId: 3,
    });

    component.reset();

    expect(component.form.getRawValue()).toEqual({
      kind: 'movie',
      title: '',
      year: null,
      storageUnitId: null,
    });
  });
});
