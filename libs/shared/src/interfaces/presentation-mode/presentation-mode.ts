import { PresentationMode } from './presentation-mode.enum';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

/**
 * Injectable interface that provides information about the app's current presentation state.
 */
@Injectable()
export abstract class PresentationModeProvider {
  /**
   * Gets the app's current presentation mode.
   */
  abstract readonly presentationMode: PresentationMode;

  /**
   * Emits the app's current presentation mode.
   */
  abstract readonly presentationMode$: Observable<PresentationMode>;

  /**
   * Amount of time in milliseconds a view is visible before the next view is presented.
   */
  abstract readonly pageDuration: number;

  /**
   * Emits the name of the currently presented page.
   */
  abstract readonly currentPage$: Observable<string>;
}
