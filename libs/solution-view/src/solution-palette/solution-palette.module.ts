import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule, MatTabsModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';
import { ServiceTabModule } from '@cme2/solution-view/src/solution-palette/service-tab/service-tab.module';
import { AddPhaseDialogModule } from './../add-phase-dialog/add-phase-dialog.module';
import { PaletteToolbarModule } from './palette-toolbar/palette-toolbar.module';
import { PhaseTabModule } from './phase-tab/phase-tab.module';
import { ProjectTabModule } from './project-tab/project-tab.module';
import { SolutionPaletteComponent } from './solution-palette.component';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    PaletteToolbarModule,
    AddPhaseDialogModule,
    MatProgressBarModule,
    I18nModule,
    ProjectTabModule,
    PhaseTabModule,
    ServiceTabModule
  ],
  declarations: [SolutionPaletteComponent],
  exports: [SolutionPaletteComponent]
})
export class SolutionPaletteModule {}
