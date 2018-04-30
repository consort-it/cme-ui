import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OpenTicketsComponent } from './open-tickets.component';
import { WINDOW_TOKEN } from './ticket-tokens';
import { I18nModule } from '@cme2/i18n';

export function windowFactory() {
  return window;
}

@NgModule({
  imports: [CommonModule, I18nModule],
  declarations: [OpenTicketsComponent],
  exports: [OpenTicketsComponent],
  providers: [{ provide: WINDOW_TOKEN, useFactory: windowFactory }]
})
export class OpenTicketsModule {}
