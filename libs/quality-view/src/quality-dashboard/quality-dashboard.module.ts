import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityDashboardComponent } from './quality-dashboard.component';
import { FailedBuildsBarChartComponent } from './failed-builds-bar-chart/failed-builds-bar-chart.component';
import { QualityCardModule } from '../quality-card';
import { I18nModule } from '@cme2/i18n';

@NgModule({
  imports: [CommonModule, QualityCardModule, I18nModule],
  exports: [QualityDashboardComponent],
  declarations: [QualityDashboardComponent, FailedBuildsBarChartComponent]
})
export class QualityDashboardModule {}
