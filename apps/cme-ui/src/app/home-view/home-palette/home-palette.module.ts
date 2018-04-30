import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatProgressBarModule, MatTabsModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';
import { TeamEditModule } from '../team-edit/team-edit.module';
import { HomePaletteComponent } from './home-palette/home-palette.component';
import { TeamEditTabComponent } from './team-edit-tab/team-edit-tab.component';
import { ContextTabComponent } from './context-tab/context-tab.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressBarModule,
    MatButtonModule,
    I18nModule,
    TeamEditModule,
    FormsModule
  ],
  declarations: [HomePaletteComponent, TeamEditTabComponent, ContextTabComponent],
  exports: [HomePaletteComponent]
})
export class HomePaletteModule {}
