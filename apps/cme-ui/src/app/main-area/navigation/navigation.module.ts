import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule, MatListModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@cme2/i18n';

import { NavigationComponent } from './navigation.component';

@NgModule({
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, I18nModule],
  declarations: [NavigationComponent],
  exports: [NavigationComponent]
})
export class NavigationModule {}
