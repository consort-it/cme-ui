import { PresentationMode, PresentationModeProvider } from '@cme2/shared';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export class PresentationModeFakeService extends PresentationModeProvider {
  currentPage$: Observable<string> = of('');
  presentationMode: PresentationMode = PresentationMode.Off;
  presentationMode$: Observable<PresentationMode> = of(PresentationMode.Off);
  pageDuration = 10;
}
