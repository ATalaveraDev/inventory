import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCardComponent } from './media-card.component';
import { MediaItem } from '../../models/media-item';

const MOVIE: MediaItem = {
  id: 1,
  kind: 'movie',
  title: 'Seven Samurai',
  year: 1954,
  storageUnitId: 3,
};

describe('MediaCardComponent', () => {
  let fixture: ComponentFixture<MediaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaCardComponent);
    fixture.componentRef.setInput('item', MOVIE);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the title, kind and year', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card__title')?.textContent).toContain('Seven Samurai');
    expect(compiled.querySelector('.card__kind')?.textContent).toContain('Movie');
    expect(compiled.textContent).toContain('1954');
  });

  it('should read as unfiled until a storage unit name is given', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Unfiled');

    fixture.componentRef.setInput('storageUnitName', 'Shelf A');
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Shelf A');
    expect(compiled.textContent).not.toContain('Unfiled');
  });

  it('should mark series so the two kinds are told apart', () => {
    fixture.componentRef.setInput('item', { ...MOVIE, kind: 'series' });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card--series')).toBeTruthy();
    expect(compiled.querySelector('.card__kind')?.textContent).toContain('Series');
  });

  it('should stand in for a missing year', () => {
    fixture.componentRef.setInput('item', { ...MOVIE, year: null });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.fact__value--figure')?.textContent?.trim()).toBe('—');
  });
});
