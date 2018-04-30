import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatSidenavModule } from '@angular/material';

import { ViewContainerContentDirective } from './view-container-content.directive';
import { ViewContainerPaletteDirective } from './view-container-palette.directive';
import { ViewContainerPaletteHeaderDirective } from './view-container-palette-header.directive';
import { ViewContainerComponent } from './view-container.component';

@NgModule({
  imports: [CommonModule, MatSidenavModule, MatButtonModule, MatIconModule],
  declarations: [
    ViewContainerComponent,
    ViewContainerPaletteDirective,
    ViewContainerContentDirective,
    ViewContainerPaletteHeaderDirective
  ],
  exports: [
    ViewContainerComponent,
    ViewContainerPaletteDirective,
    ViewContainerContentDirective,
    ViewContainerPaletteHeaderDirective
  ]
})
export class ViewContainerModule {}
