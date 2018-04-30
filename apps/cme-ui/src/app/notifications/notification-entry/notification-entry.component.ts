import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { NotificationEvent, NotificationType } from '@cme2/core-services';

/**
 * Displays a notification in the NotificationPanel.
 */
@Component({
  selector: 'cme-notification-entry',
  templateUrl: './notification-entry.component.html',
  styleUrls: ['./notification-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationEntryComponent {
  @Input() notification: NotificationEvent | undefined;

  get iconType(): string {
    if (this.notification) {
      switch (this.notification.type) {
        case NotificationType.Alert:
          return 'error';
        case NotificationType.Warning:
          return 'warning';
        default:
          return 'info';
      }
    } else {
      return '';
    }
  }

  shorten(text: string, maxChars: number): string {
    return text.length <= maxChars ? text : text.substr(0, maxChars) + '...';
  }
}
