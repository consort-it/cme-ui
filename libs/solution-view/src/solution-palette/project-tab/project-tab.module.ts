import { PaletteToolbarModule } from './../palette-toolbar/palette-toolbar.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTabComponent } from './project-tab.component';

@NgModule({
  imports: [CommonModule, PaletteToolbarModule],
  declarations: [ProjectTabComponent],
  exports: [ProjectTabComponent]
})
export class ProjectTabModule {}
