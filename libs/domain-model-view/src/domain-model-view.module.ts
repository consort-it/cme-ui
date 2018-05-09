import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ViewContainerModule } from '@cme2/shared';

import { DomainModelViewComponent } from './domain-model-view.component';
import { I18nModule } from '@cme2/i18n';
import * as translationsDe from './i18n/de.json';
import * as translationsEn from './i18n/en.json';

// Translations must be exported to work with aot in prod build!
export const en = translationsEn;
export const de = translationsDe;

@NgModule({
  imports: [
    CommonModule,
    ViewContainerModule,
    RouterModule.forChild([
      {
        path: '',
        component: DomainModelViewComponent
      }
    ]),
    I18nModule.forChild({ en, de })
  ],
  declarations: [DomainModelViewComponent]
})
export class DomainModelViewModule {}
