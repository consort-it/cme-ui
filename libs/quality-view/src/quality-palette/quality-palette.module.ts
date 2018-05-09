import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QualityPaletteComponent } from './quality-palette/quality-palette.component';
import { QualityBreadCrumbsComponent } from './quality-bread-crumbs/quality-bread-crumbs.component';
import { QualityPaletteService } from '@cme2/quality-view/src/quality-palette/services/quality-palette.service';
import { I18nModule } from '@cme2/i18n';
import { FailedBuildsModule } from './failed-builds/failed-builds.module';
import { OpenBugsModule } from './open-bugs/open-bugs.module';

@NgModule({
  imports: [CommonModule, I18nModule, FailedBuildsModule, OpenBugsModule],
  declarations: [QualityPaletteComponent, QualityBreadCrumbsComponent],
  exports: [QualityPaletteComponent, QualityBreadCrumbsComponent],
  providers: [QualityPaletteService]
})
export class QualityPaletteModule {}
