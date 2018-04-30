import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatDividerModule, MatIconModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@cme2/i18n';

import { ClusterManagerModule } from '../cluster-manager/cluster-manager.module';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    ClusterManagerModule,
    I18nModule,
    RouterModule
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {}
