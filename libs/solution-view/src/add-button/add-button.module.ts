import { MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddButtonComponent } from './add-button.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
  declarations: [AddButtonComponent],
  exports: [AddButtonComponent]
})
export class AddButtonModule {}
