import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatGridListModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';
import { ViewContainerModule } from '@cme2/shared';
import * as translationsDe from './i18n/de.json';
import * as translationsEn from './i18n/en.json';
import { QualityCardModule } from './quality-card';
import { QualityDashboardComponent } from './quality-dashboard/quality-dashboard.component';
import { QualityViewRoutingModule } from './quality-view-routing.module';
import { QualityViewComponent } from './quality-view.component';
import { QualityService } from './services/quality.service';
import { ApiModule as QualityBackendModule } from '@cme2/connector-quality';

// Translations must be exported to work with aot in prod build
export const en = translationsEn;
export const de = translationsDe;

@NgModule({
  imports: [
    CommonModule,
    QualityViewRoutingModule,
    MatGridListModule,
    QualityCardModule,
    ViewContainerModule,
    I18nModule.forChild({ en, de }),
    QualityBackendModule.forRoot()
  ],
  declarations: [QualityViewComponent, QualityDashboardComponent],
  providers: []
})
export class QualityViewModule {}
