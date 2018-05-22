import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatListModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { ApiModule as DomainModelModule } from '@cme2/connector-domain-model';
import { I18nModule } from '@cme2/i18n';
import { EventsModule, ViewContainerModule } from '@cme2/shared';
import { DomainCardModule } from './domain-card';
import { DomainModelPaletteModule } from './domain-model-palette/domain-model-palette.module';
import { DomainModelViewComponent } from './domain-model-view.component';
import { DomainModelDragAndDropDirective } from './drag-and-drop/domain-model-drag-and-drop.directive';
import * as translationsDe from './i18n/de.json';
import * as translationsEn from './i18n/en.json';
import { DomainModelService } from './services/domain-model.service';

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
    I18nModule.forChild({ en, de }),
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule,
    DomainModelModule.forRoot(),
    DomainModelPaletteModule,
    EventsModule,
    DomainCardModule
  ],
  providers: [DomainModelService],
  declarations: [DomainModelViewComponent, DomainModelDragAndDropDirective]
})
export class DomainModelViewModule {}
