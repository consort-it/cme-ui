import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';
import { I18nModule } from '@cme2/i18n';
import { DialogToolbarModule, UniqueValidatorModule } from '@cme2/shared';

import { AddPhaseDialogComponent } from './add-phase-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    DialogToolbarModule,
    UniqueValidatorModule,
    I18nModule.forChild({
      en: require('./../i18n/en.json'),
      de: require('./../i18n/de.json')
    })
  ],
  declarations: [AddPhaseDialogComponent],
  entryComponents: [AddPhaseDialogComponent]
})
export class AddPhaseDialogModule {}
