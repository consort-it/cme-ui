import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IConnectionChange } from './iconnection-change';

/**
 * Notifies anyone interested when the cluster connection changes.
 */
@Injectable()
export abstract class ConnectionChangeService implements IConnectionChange {
  abstract get connectionChanged$(): Observable<void>;
}
