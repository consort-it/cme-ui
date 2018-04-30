import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@cme2/i18n';
import { ViewContainerModule } from '@cme2/shared';

import { HomeViewRoutingModule } from './home-view-routing.module';
import { HomeViewComponent } from './home-view.component';
import { TeamViewComponent } from './team-view/team-view.component';
import { MatCardModule, MatDividerModule, MatListModule, MatChipsModule, MatIconModule } from '@angular/material';
import { HomePaletteModule } from './home-palette/home-palette.module';
import { ContextViewComponent } from './context-view/context-view.component';

@NgModule({
  imports: [
    CommonModule,
    HomeViewRoutingModule,
    ViewContainerModule,
    I18nModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule,
    MatIconModule,
    HomePaletteModule
  ],
  declarations: [HomeViewComponent, TeamViewComponent, ContextViewComponent],
  exports: [TeamViewComponent]
})
export class HomeViewModule {}
