import { Observable } from 'rxjs/Observable';

export interface IConnectionChange {
  /**
   * Emits an event whenever the cluster connection changed.
   * Components and services can subscribe to this and reload their data
   * when this happens.
   */
  connectionChanged$: Observable<void>;
}
