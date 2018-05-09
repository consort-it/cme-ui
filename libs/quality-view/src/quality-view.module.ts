import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';
import { ViewContainerModule } from '@cme2/shared';
import { ApiModule as QualityBackendModule } from '@cme2/connector-quality';
import { ApiModule as JiraBackendModule } from '@cme2/connector-jira';
import * as translationsDe from './i18n/de.json';
import * as translationsEn from './i18n/en.json';
import { QualityPaletteModule } from './quality-palette/quality-palette.module';
import { QualityViewRoutingModule } from './quality-view-routing.module';
import { QualityViewComponent } from './quality-view.component';
import { QualityDashboardModule } from '@cme2/quality-view/src/quality-dashboard';

// Translations must be exported to work with aot in prod build
export const en = translationsEn;
export const de = translationsDe;

@NgModule({
  imports: [
    CommonModule,
    QualityViewRoutingModule,
    MatGridListModule,
    QualityDashboardModule,
    ViewContainerModule,
    I18nModule.forChild({ en, de }),
    QualityPaletteModule,
    ViewContainerModule,
    QualityBackendModule.forRoot(),
    JiraBackendModule.forRoot()
  ],
  declarations: [QualityViewComponent],
  providers: []
})
export class QualityViewModule {}
