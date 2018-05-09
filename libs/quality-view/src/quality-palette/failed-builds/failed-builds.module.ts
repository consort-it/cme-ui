import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailedBuildsComponent } from './failed-builds/failed-builds.component';
import { MatListModule, MatIconModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';

@NgModule({
  imports: [CommonModule, MatListModule, MatIconModule, I18nModule],
  declarations: [FailedBuildsComponent],
  exports: [FailedBuildsComponent]
})
export class FailedBuildsModule {}
