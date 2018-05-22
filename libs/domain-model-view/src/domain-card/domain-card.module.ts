import { NgModule } from '@angular/core';
import { DomainCardComponent } from './domain-card';
import { ModelPropertyComponent } from './model-property';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatDividerModule, MatCardModule, MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [CommonModule, MatIconModule, MatDividerModule, MatCardModule, MatTooltipModule],
  declarations: [DomainCardComponent, ModelPropertyComponent],
  exports: [DomainCardComponent, ModelPropertyComponent]
})
export class DomainCardModule {}
