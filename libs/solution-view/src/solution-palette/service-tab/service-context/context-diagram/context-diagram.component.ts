import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cme-context-diagram',
  templateUrl: './context-diagram.component.html',
  styleUrls: ['./context-diagram.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextDiagramComponent {
  @Input() public hasEndpoints = false;
  @Input() public hasScopes = false;
  @Input() public hasWorkers = false;
  @Input() public hasDependencies = false;
  @Input() public hasPersistence = false;
  @Input() public hasKPIs = false;
  @Input() public hasFeatureToggles = false;

  @Output() public dependenciesClick = new EventEmitter<undefined>();

  @Output() public messageQueueClick = new EventEmitter<undefined>();

  @Output() public persistenceClick = new EventEmitter<undefined>();
}
