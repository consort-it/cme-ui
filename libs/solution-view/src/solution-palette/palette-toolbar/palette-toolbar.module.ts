import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatTooltipModule } from '@angular/material';

import { PaletteToolbarButtonComponent } from './palette-toolbar-button/palette-toolbar-button.component';
import { PaletteToolbarComponent } from './palette-toolbar.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule],
  declarations: [PaletteToolbarComponent, PaletteToolbarButtonComponent],
  exports: [PaletteToolbarComponent, PaletteToolbarButtonComponent]
})
export class PaletteToolbarModule {}
