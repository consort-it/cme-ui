import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatExpansionModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { I18nModule } from '@cme2/i18n';
import { DomainCardModule } from '../domain-card';
import { DomainModelBreadCrumbsComponent } from './domain-model-bread-crumbs/domain-model-bread-crumbs.component';
import { DomainModelPaletteComponent } from './domain-model-palette/domain-model-palette.component';
import { DomainModelPaletteService } from './services/domain-model-palette.service';
import { IconNameComponent } from './icon-name/icon-name.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventsModule } from '@cme2/shared';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    I18nModule.forChild(),
    MatExpansionModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    DomainCardModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    EventsModule
  ],
  declarations: [DomainModelPaletteComponent, DomainModelBreadCrumbsComponent, IconNameComponent],
  exports: [DomainModelPaletteComponent, DomainModelBreadCrumbsComponent],
  providers: [DomainModelPaletteService]
})
export class DomainModelPaletteModule {}
