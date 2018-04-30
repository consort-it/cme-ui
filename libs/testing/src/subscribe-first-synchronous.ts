import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

export const subscribeFirstSynchronous = <T>(o: Observable<T>): T => {
  let value: T = undefined!;
  let gotData = false;
  o.pipe(first()).subscribe(x => {
    value = x;
    gotData = true;
  });
  if (!gotData) {
    throw new Error('observable did not emit a value synchronously.');
  }
  return value;
};
