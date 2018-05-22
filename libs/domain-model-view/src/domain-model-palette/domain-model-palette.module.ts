import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatExpansionModule, MatTabsModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';
import { DomainCardModule } from '../domain-card';
import { DomainModelBreadCrumbsComponent } from './domain-model-bread-crumbs/domain-model-bread-crumbs.component';
import { DomainModelPaletteComponent } from './domain-model-palette/domain-model-palette.component';
import { DomainModelPaletteService } from './services/domain-model-palette.service';

@NgModule({
  imports: [CommonModule, MatTabsModule, MatButtonModule, I18nModule.forChild(), MatExpansionModule, DomainCardModule],
  declarations: [DomainModelPaletteComponent, DomainModelBreadCrumbsComponent],
  exports: [DomainModelPaletteComponent, DomainModelBreadCrumbsComponent],
  providers: [DomainModelPaletteService]
})
export class DomainModelPaletteModule {}
