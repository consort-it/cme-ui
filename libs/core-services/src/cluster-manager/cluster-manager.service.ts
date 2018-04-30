import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { NotificationService } from '../notification';
import { StorageService } from '../storage';
import { ClusterConnection } from './cluster-connection';
import { ConnectionCheckResult } from './connection-check-result';
import { ConnectionChecker } from './connection-checker';
import { HostnameService } from '@cme2/connector-base';
import { map, skip, mapTo } from 'rxjs/operators';
import { ConnectionChangeService } from '@cme2/core-services/src/connection-change/connection-change.service';
import { IConnectionChange } from '@cme2/core-services/src/connection-change/iconnection-change';

export const STORAGE_KEY_AVAILABLE_CONNECTIONS = 'cme2.availableClusterConnections';
export const STORAGE_KEY_CURRENT_CONNECTION = 'cme2.currentClusterConnection';

@Injectable()
export class ClusterManagerService extends HostnameService implements IConnectionChange {
  private _currentConnection$$ = new ReplaySubject<ClusterConnection>(1);
  private _availableConnections$$ = new ReplaySubject<ClusterConnection[]>(1);
  private _hasCurrentConnection$$ = new ReplaySubject<boolean>(1);
  private _hostname$ = this._currentConnection$$.pipe(
    map(x => x.hostname),
    map(hostname => {
      if (hostname.endsWith('/')) {
        return hostname.substr(0, hostname.length - 1);
      }
      return hostname;
    })
  );

  get hostname$(): Observable<string> {
    return this._hostname$;
  }

  get connectionChanged$(): Observable<void> {
    return this._hostname$.pipe(skip(1), mapTo(void 0));
  }

  constructor(
    private httpClient: HttpClient,
    private storage: StorageService,
    private logger: LogService,
    private notificationService: NotificationService,
    private connectionChecker: ConnectionChecker
  ) {
    super(logger);
    this.init();
  }

  get currentConnection$(): Observable<ClusterConnection> {
    return this._currentConnection$$.asObservable();
  }

  get hasCurrentConnection$(): Observable<boolean> {
    return this._hasCurrentConnection$$.asObservable();
  }

  get availableConnections$(): Observable<ClusterConnection[]> {
    return this._availableConnections$$.asObservable();
  }

  addConnection(newConnection: ClusterConnection) {
    const availableConnections: ClusterConnection[] = JSON.parse(
      this.storage.getItem(STORAGE_KEY_AVAILABLE_CONNECTIONS) || '[]'
    );

    availableConnections.push(newConnection);
    this.storage.setItem(STORAGE_KEY_AVAILABLE_CONNECTIONS, JSON.stringify(availableConnections));
    if (availableConnections.length === 1) {
      // our new conn is the only one, set as current...
      this.setCurrentConnection(newConnection);
    }
    this.init();
  }

  setCurrentConnection(connection: ClusterConnection) {
    this.storage.setItem(STORAGE_KEY_CURRENT_CONNECTION, JSON.stringify(connection));
    this._currentConnection$$.next(connection);
  }

  removeCurrentConnection() {
    this.storage.removeItem(STORAGE_KEY_CURRENT_CONNECTION);
  }

  removeConnectionById(id: string) {
    const availableConnections: ClusterConnection[] = JSON.parse(
      this.storage.getItem(STORAGE_KEY_AVAILABLE_CONNECTIONS) || '[]'
    );

    const idx = availableConnections.findIndex(x => x.id === id);

    if (idx > -1) {
      availableConnections.splice(idx, 1);
    }

    this.storage.setItem(STORAGE_KEY_AVAILABLE_CONNECTIONS, JSON.stringify(availableConnections));

    const currentConnection = this.getCurrentConnection();
    if (currentConnection && currentConnection.id === id) {
      this.removeCurrentConnection();
      if (availableConnections.length > 0) {
        // if there is a remaining connection, set it as current.
        this.setCurrentConnection(availableConnections[0]);
      }
    }
    this.init();
  }

  clearAll(): void {
    this.storage.removeItem(STORAGE_KEY_AVAILABLE_CONNECTIONS);
    this.storage.removeItem(STORAGE_KEY_CURRENT_CONNECTION);
    this.init();
  }

  isConnectionReachable(connection: ClusterConnection): Observable<ConnectionCheckResult> {
    return this.connectionChecker.isConnectionReachable(connection);
  }

  private init() {
    this.logger.trace('ClusterManagerService.init()');
    const availableConnections: ClusterConnection[] = JSON.parse(
      this.storage.getItem(STORAGE_KEY_AVAILABLE_CONNECTIONS) || '[]'
    );
    this.logger.trace('ClusterManagerService.availableConnections$', availableConnections);
    this._availableConnections$$.next(availableConnections);

    const currentConnection = this.getCurrentConnection();
    if (currentConnection) {
      this._hasCurrentConnection$$.next(true);
      this._currentConnection$$.next(currentConnection);
    } else {
      this._hasCurrentConnection$$.next(false);
    }
  }

  private getCurrentConnection(): ClusterConnection | undefined {
    const currentConnectionJsonString: string | null = this.storage.getItem(STORAGE_KEY_CURRENT_CONNECTION);
    if (currentConnectionJsonString) {
      const currentConnection: ClusterConnection = JSON.parse(currentConnectionJsonString);
      return currentConnection;
    }
    return undefined;
  }
}
