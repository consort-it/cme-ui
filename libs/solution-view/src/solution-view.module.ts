import { SolutionBreadCrumbsModule } from './solution-bread-crumbs/solution-bread-crumbs.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { ApiModule as JiraBackendModule } from '@cme2/connector-jira';
import { I18nModule } from '@cme2/i18n';
import { ViewContainerModule } from '@cme2/shared';

import { AddButtonModule } from './add-button/add-button.module';
import { AddPhaseDialogModule } from './add-phase-dialog/add-phase-dialog.module';
import { AddServiceDialogModule } from './add-service-dialog/add-service-dialog.module';
import { DragAndDropModule } from './drag-and-drop/drag-and-drop.module';
import * as translationsDe from './i18n/de.json';
import * as translationsEn from './i18n/en.json';
import { JiraService, SolutionPaletteService } from './shared';
import { SolutionMicroserviceModule } from './solution-microservice/solution-microservice.module';
import { SolutionPaletteModule } from './solution-palette/solution-palette.module';
import { SolutionPhaseComponent } from './solution-phase/solution-phase.component';
import { SolutionTraceComponent } from './solution-trace/solution-trace.component';
import { SolutionViewRoutingModule } from './solution-view-routing.module';
import { SolutionViewComponent } from './solution-view.component';

// Translations must be exported to work with aot in prod build
export const en = translationsEn;
export const de = translationsDe;

@NgModule({
  imports: [
    CommonModule,
    SolutionViewRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    SolutionMicroserviceModule,
    DragAndDropModule,
    ViewContainerModule,
    AddButtonModule,
    AddPhaseDialogModule,
    AddServiceDialogModule,
    SolutionPaletteModule,
    SolutionBreadCrumbsModule,
    JiraBackendModule.forRoot(),
    I18nModule.forChild({ en, de })
  ],
  declarations: [SolutionViewComponent, SolutionPhaseComponent, SolutionTraceComponent],
  providers: [SolutionPaletteService, JiraService]
})
export class SolutionViewModule {}
