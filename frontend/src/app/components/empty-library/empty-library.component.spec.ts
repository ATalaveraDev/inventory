import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyLibraryComponent } from './empty-library.component';

describe('EmptyLibraryComponent', () => {
  let fixture: ComponentFixture<EmptyLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyLibraryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyLibraryComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should invite a first title when the library is empty', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty__title')?.textContent).toContain('library is empty');
  });

  it('should point at the filter when it is what hides everything', () => {
    fixture.componentRef.setInput('filtered', true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty__title')?.textContent).toContain('Nothing of that kind');
  });
});
