import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityShowCaseComponent } from './quality-show-case/quality-show-case.component';
import { QualityCardModule } from '../../../../../libs/quality-view/src/quality-card/quality-card.module'; // tslint:disable-line
import { MatSliderModule, MatFormFieldModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, QualityCardModule, MatSliderModule, MatFormFieldModule, FormsModule],
  declarations: [QualityShowCaseComponent],
  exports: [QualityShowCaseComponent]
})
export class QualityShowCaseModule {}
