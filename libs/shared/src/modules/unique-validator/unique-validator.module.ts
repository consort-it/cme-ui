import { UniqueValueDirective } from './unique-value.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  declarations: [UniqueValueDirective],
  exports: [UniqueValueDirective]
})
export class UniqueValidatorModule {}
