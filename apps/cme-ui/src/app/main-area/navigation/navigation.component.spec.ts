import { NavigationComponent } from './navigation.component';
import { first } from 'rxjs/operators';

describe('NavigationComponent', () => {
  it('should emit entrySelected when entry was clicked', (done: DoneFn) => {
    const component = new NavigationComponent();
    component.entrySelected.pipe(first()).subscribe(() => {
      done();
    });
    component.onEntryClick();
  });
});
