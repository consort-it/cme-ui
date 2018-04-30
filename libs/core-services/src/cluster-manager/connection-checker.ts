import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, mapTo, timeout } from 'rxjs/operators';

import { NotificationService, NotificationType } from '../notification';
import { ClusterConnection } from './cluster-connection';
import { ConnectionCheckResult } from './connection-check-result';

const CONNECTION_TEST_TIMEOUT = 5000;

@Injectable()
export class ConnectionChecker {
  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService,
    private logger: LogService
  ) {}

  isConnectionReachable(connection: ClusterConnection): Observable<ConnectionCheckResult> {
    const testUrl = connection.hostname + '/api/v1/metadata-service/projects';
    return this.httpClient.get(testUrl).pipe(
      timeout(CONNECTION_TEST_TIMEOUT),

      mapTo(<ConnectionCheckResult>{ status: 'OK', message: 'OK', hostname: connection.hostname }),

      catchError((err: any) => {
        const message = `Connection to '${testUrl}' is broken: ${err.message}`;
        this.notificationService.addNotification('Broken cluster connection', message, NotificationType.Alert);
        this.logger.error(`Connection to '${testUrl}' is broken`, err);
        return of(<ConnectionCheckResult>{ status: 'ERROR', message: err.message, hostname: connection.hostname });
      })
    );
  }
}
