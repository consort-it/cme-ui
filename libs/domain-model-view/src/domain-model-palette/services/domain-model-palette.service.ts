import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DomainModel } from '@cme2/connector-domain-model';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class DomainModelPaletteService {
  _isOpen$$ = new BehaviorSubject<boolean>(false);

  _context$$ = new BehaviorSubject<DomainModel | undefined>(undefined);

  get isOpen$(): Observable<boolean> {
    return this._isOpen$$.pipe(distinctUntilChanged());
  }

  get context$(): Observable<DomainModel | undefined> {
    return this._context$$;
  }

  constructor() {}

  setContext(context: DomainModel) {
    if (context === this._context$$.value) {
      this.resetContext();
    } else {
      this._context$$.next(context);
    }
  }

  resetContext() {
    this._context$$.next(undefined);
  }

  open() {
    this._isOpen$$.next(true);
  }

  close() {
    this._isOpen$$.next(false);
  }
}
