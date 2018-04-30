import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { NotificationService } from '@cme2/core-services';

@Component({
  selector: 'cme-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationPanelComponent {
  @HostBinding('class.mat-elevation-z2') _shadow = true;

  constructor(public notificationService: NotificationService) {}
}
