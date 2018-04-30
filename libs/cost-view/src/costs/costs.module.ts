import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatProgressBarModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';

import { CostsOfMonthComponent } from './costs-of-month/costs-of-month.component';
import { CostsComponent } from './costs.component';
import { CostsService } from './shared/costs.service';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule, CdkTableModule, I18nModule],
  declarations: [CostsOfMonthComponent, CostsComponent],
  exports: [CostsComponent],
  providers: [CostsService]
})
export class CostsModule {}
