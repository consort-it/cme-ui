import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiModule as ConnectorCostsModule } from '@cme2/connector-aws-costs';
import { I18nModule } from '@cme2/i18n';
import { ViewContainerModule } from '@cme2/shared';

import { CostViewRoutingModule } from './cost-view-routing.module';
import { CostViewComponent } from './cost-view.component';
import { CostsModule } from './costs/costs.module';
import * as translationsDe from './i18n/de.json';
import * as translationsEn from './i18n/en.json';

// Translations must be exported to work with aot in prod build
export const en = translationsEn;
export const de = translationsDe;

@NgModule({
  imports: [
    CommonModule,
    CostViewRoutingModule,
    ViewContainerModule,
    ConnectorCostsModule.forRoot(),
    CostsModule,
    I18nModule.forChild({ en, de })
  ],
  declarations: [CostViewComponent]
})
export class CostViewModule {}
