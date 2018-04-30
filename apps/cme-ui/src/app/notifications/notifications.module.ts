import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule, MatIconModule } from '@angular/material';

import { NotificationEntryComponent } from './notification-entry/notification-entry.component';
import { NotificationPanelComponent } from './notification-panel/notification-panel.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatDividerModule],
  declarations: [NotificationPanelComponent, NotificationEntryComponent],
  exports: [NotificationPanelComponent],
  entryComponents: [NotificationPanelComponent]
})
export class NotificationsModule {}
