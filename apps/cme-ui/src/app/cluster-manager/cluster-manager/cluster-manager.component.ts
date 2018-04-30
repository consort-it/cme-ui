import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { ClusterConnection, ClusterManagerService, ConnectionCheckResult } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cme-cluster-manager',
  templateUrl: './cluster-manager.component.html',
  styleUrls: ['./cluster-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClusterManagerComponent {
  public showAddConnection = false;
  private _connectionCheckCache = new Map<string, Observable<ConnectionCheckResult>>();

  /**
   * Emits when user clicks on "go to Home" button.
   */
  @Output() close = new EventEmitter<void>();

  constructor(public readonly clusterManager: ClusterManagerService, private logger: LogService) {}

  onNewConnection(connection: ClusterConnection) {
    this.showAddConnection = false;
    this.clusterManager.addConnection(connection);
  }

  onDeleteConnection(connection: ClusterConnection) {
    this.clusterManager.removeConnectionById(connection.id);
  }

  onSetCurrentConnection(connection: ClusterConnection) {
    this.onClearCheckResults();
    this.clusterManager.setCurrentConnection(connection);
  }

  onClearAll() {
    this.clusterManager.clearAll();
  }

  checkConnection(connection: ClusterConnection): Observable<ConnectionCheckResult> {
    if (!this._connectionCheckCache.has(connection.hostname)) {
      this.logger.debug(`Triggering new check request for '${connection.hostname}'`, connection);
      this._connectionCheckCache.set(connection.hostname, this.clusterManager.isConnectionReachable(connection));
    } else {
      this.logger.debug(`Using cached request for '${connection.hostname}'`, connection);
    }

    const result = this._connectionCheckCache.get(connection.hostname);
    if (!result) {
      throw new Error(`BUG: Could not check connection for hostname '${connection.hostname}'`);
    }
    return result;
  }

  onClearCheckResults() {
    this._connectionCheckCache.clear();
  }
}
