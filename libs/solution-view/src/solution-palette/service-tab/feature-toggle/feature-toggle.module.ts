import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureToggleComponent } from './feature-toggle.component';
import { FeatureToggleService } from './feature-toggle.service';
import { I18nModule } from '@cme2/i18n';
import { ApiModule as FeatureToggleServiceModule } from '@cme2/connector-feature-toggle-service';
import { MatSlideToggleModule, MatProgressBarModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, I18nModule, FeatureToggleServiceModule.forRoot(), MatSlideToggleModule, MatProgressBarModule],
  declarations: [FeatureToggleComponent],
  exports: [FeatureToggleComponent],
  providers: [FeatureToggleService]
})
export class FeatureToggleModule {}
