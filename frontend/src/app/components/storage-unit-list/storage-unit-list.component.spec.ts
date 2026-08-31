import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageUnitListComponent } from './storage-unit-list.component';

describe('StorageUnitListComponent', () => {
  let fixture: ComponentFixture<StorageUnitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageUnitListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StorageUnitListComponent);
    fixture.componentRef.setInput('units', [
      { id: 1, name: 'Shelf A', capacity: 120 },
      { id: 2, name: 'Box 2', capacity: 40 },
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a row per unit', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.list__row').length).toBe(2);
  });
});
