import { I18nModule } from '@cme2/i18n';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolutionBreadCrumbsComponent } from './solution-bread-crumbs.component';

@NgModule({
  imports: [CommonModule, I18nModule],
  declarations: [SolutionBreadCrumbsComponent],
  exports: [SolutionBreadCrumbsComponent]
})
export class SolutionBreadCrumbsModule {}
