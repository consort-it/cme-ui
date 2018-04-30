import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityCardComponent } from './quality-card/quality-card.component';
import { MatCardModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { IconWithIndicatorComponent } from './icon-with-indicator/icon-with-indicator.component';
import { InlineSvgComponent } from './inline-svg/inline-svg.component';
import { ValueComponent } from './value/value.component';

@NgModule({
  imports: [CommonModule, MatCardModule, MatIconModule, MatTooltipModule],
  declarations: [QualityCardComponent, IconWithIndicatorComponent, InlineSvgComponent, ValueComponent],
  exports: [QualityCardComponent, IconWithIndicatorComponent, ValueComponent]
})
export class QualityCardModule {}
