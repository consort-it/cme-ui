import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PresentationProgressBarComponent } from './presentation-progress-bar.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PresentationProgressBarComponent],
  exports: [PresentationProgressBarComponent]
})
export class PresentationProgressBarModule {}
