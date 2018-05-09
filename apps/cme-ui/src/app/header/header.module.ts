import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { I18nModule } from '@cme2/i18n';

import { NotificationsModule } from '../notifications/notifications.module';
import { HeaderComponent } from './header.component';
import { ProjectDropdownComponent } from './project-dropdown/project-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    NotificationsModule,
    MatTooltipModule,
    I18nModule
  ],
  declarations: [HeaderComponent, ProjectDropdownComponent],
  exports: [HeaderComponent]
})
export class HeaderModule {}
