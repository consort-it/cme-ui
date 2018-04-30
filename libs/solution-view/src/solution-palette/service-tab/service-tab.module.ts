import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatExpansionModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';
import { PaletteToolbarModule } from './../palette-toolbar/palette-toolbar.module';
import { LastCommitModule } from './last-commit';
import { LogsModule } from './logs/logs.module';
import { OpenTicketsModule } from './open-tickets/open-tickets.module';
import { ServiceTabComponent } from './service-tab.component';

@NgModule({
  imports: [
    CommonModule,
    PaletteToolbarModule,
    I18nModule,
    LogsModule,
    MatButtonModule,
    MatExpansionModule,
    OpenTicketsModule,
    LastCommitModule
  ],
  declarations: [ServiceTabComponent],
  exports: [ServiceTabComponent]
})
export class ServiceTabModule {}
