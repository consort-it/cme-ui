import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DragAndDropService {
  private dragstart$$: Subject<HTMLElement> = new Subject<HTMLElement>();
  private dragend$$: Subject<HTMLElement> = new Subject<HTMLElement>();

  constructor() {}

  dragstart(element: HTMLElement) {
    this.dragstart$$.next(element);
  }

  get dragstart$(): Observable<HTMLElement> {
    return this.dragstart$$.asObservable();
  }

  dragend(element: HTMLElement) {
    this.dragend$$.next(element);
  }

  get dragend$(): Observable<HTMLElement> {
    return this.dragend$$.asObservable();
  }
}
