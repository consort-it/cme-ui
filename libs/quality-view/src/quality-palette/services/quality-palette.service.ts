import { Injectable } from '@angular/core';
import { QualityStatus } from '@cme2/connector-quality';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CategoryAndTitle } from './category-and-title.model';

@Injectable()
export class QualityPaletteService {
  _isOpen$$ = new BehaviorSubject<boolean>(false);

  _context$$ = new BehaviorSubject<CategoryAndTitle | undefined>(undefined);

  get isOpen$(): Observable<boolean> {
    return this._isOpen$$;
  }

  get context$(): Observable<CategoryAndTitle | undefined> {
    return this._context$$;
  }

  constructor() {}

  openContext(context: CategoryAndTitle) {
    this._context$$.next(context);
    this._isOpen$$.next(true);
  }

  close() {
    this._isOpen$$.next(false);
  }
}
