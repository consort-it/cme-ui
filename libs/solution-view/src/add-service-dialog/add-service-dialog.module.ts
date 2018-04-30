import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddServiceDialogComponent } from './add-service-dialog.component';
import { FormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatToolbarModule,
  MatSelectModule
} from '@angular/material';
import { UniqueValidatorModule, DialogToolbarModule } from '@cme2/shared';
import { I18nModule } from '@cme2/i18n';
import { CustomFormsModule } from 'ng4-validators';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    DialogToolbarModule,
    UniqueValidatorModule,
    MatSelectModule,
    I18nModule.forChild({
      en: require('./../i18n/en.json'),
      de: require('./../i18n/de.json')
    })
  ],
  declarations: [AddServiceDialogComponent],
  entryComponents: [AddServiceDialogComponent]
})
export class AddServiceDialogModule {}
