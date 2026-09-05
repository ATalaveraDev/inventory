import { Component, input } from '@angular/core';

/** The nothing-here-yet state for the library. */
@Component({
  selector: 'app-empty-library',
  imports: [],
  templateUrl: './empty-library.component.html',
  styleUrl: './empty-library.component.css'
})
export class EmptyLibraryComponent {
  /**
   * True when titles exist but the current filter hides all of them, which is
   * a dead end the reader gets out of by widening the filter, not by adding.
   */
  readonly filtered = input(false);
}
