import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaFilterComponent } from './media-filter.component';
import { MediaFilter } from '../../models/media-item';

describe('MediaFilterComponent', () => {
  let component: MediaFilterComponent;
  let fixture: ComponentFixture<MediaFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MediaFilterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selected', 'all');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark the selected option pressed', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const pressed = compiled.querySelectorAll('[aria-pressed="true"]');
    expect(pressed.length).toBe(1);
    expect(pressed[0].textContent).toContain('All');
  });

  it('should report the option that was chosen', () => {
    const chosen: MediaFilter[] = [];
    component.selectedChange.subscribe((value) => chosen.push(value));

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    buttons[1].click();

    expect(chosen).toEqual(['movie']);
  });

  it('should stay quiet when the current option is chosen again', () => {
    let emitted = 0;
    component.selectedChange.subscribe(() => emitted++);

    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll('button');
    buttons[0].click();

    expect(emitted).toBe(0);
  });
});
