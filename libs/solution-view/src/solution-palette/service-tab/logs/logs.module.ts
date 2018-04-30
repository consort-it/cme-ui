import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiModule as CloudwatchLogsModule } from '@cme2/connector-cloudwatch-logs';

import { LogsComponent } from './logs.component';
import { LogsService } from './logs.service';
import { I18nModule } from '@cme2/i18n';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, I18nModule, MatProgressBarModule, CloudwatchLogsModule.forRoot()],
  declarations: [LogsComponent],
  exports: [LogsComponent],
  providers: [LogsService]
})
export class LogsModule {}
