import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';

import { SolutionMicroserviceComponent } from './solution-microservice.component';

@NgModule({
  imports: [CommonModule, MatTooltipModule, I18nModule],
  declarations: [SolutionMicroserviceComponent],
  providers: [],
  exports: [SolutionMicroserviceComponent]
})
export class SolutionMicroserviceModule {}
