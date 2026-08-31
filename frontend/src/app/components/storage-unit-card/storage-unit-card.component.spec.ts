import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageUnitCardComponent } from './storage-unit-card.component';

describe('StorageUnitCardComponent', () => {
  let fixture: ComponentFixture<StorageUnitCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageUnitCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StorageUnitCardComponent);
    fixture.componentRef.setInput('unit', { id: 1, name: 'Shelf A', capacity: 120 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the name and capacity', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card__name')?.textContent).toContain('Shelf A');
    expect(compiled.querySelector('.card__capacity')?.textContent).toContain('120');
  });
});
