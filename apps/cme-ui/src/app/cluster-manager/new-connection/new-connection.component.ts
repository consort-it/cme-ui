import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ClusterConnection } from '@cme2/core-services';

@Component({
  selector: 'cme-new-connection',
  templateUrl: './new-connection.component.html',
  styleUrls: ['./new-connection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewConnectionComponent {
  @Output() create = new EventEmitter<ClusterConnection>();

  @Output() cancel = new EventEmitter<void>();

  public newConnection: ClusterConnection = {
    id: guid(),
    hostname: '',
    namespace: '',
    environment: ''
  };
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
