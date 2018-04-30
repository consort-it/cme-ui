import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material';

import { AddPhaseDialogModule } from './../../add-phase-dialog/add-phase-dialog.module';
import { PaletteToolbarModule } from './../palette-toolbar/palette-toolbar.module';
import { PhaseTabComponent } from './phase-tab.component';
import { I18nModule } from '@cme2/i18n';

@NgModule({
  imports: [
    CommonModule,
    PaletteToolbarModule,
    AddPhaseDialogModule,
    MatDialogModule,
    I18nModule.forChild({
      en: require('./../../i18n/en.json'),
      de: require('./../../i18n/de.json')
    })
  ],
  declarations: [PhaseTabComponent],
  exports: [PhaseTabComponent]
})
export class PhaseTabModule {}
