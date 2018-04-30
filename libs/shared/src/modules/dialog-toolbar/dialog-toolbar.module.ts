import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';

import { DialogToolbarComponent } from './dialog-toolbar.component';

@NgModule({
  imports: [CommonModule, MatToolbarModule, MatIconModule],
  declarations: [DialogToolbarComponent],
  exports: [DialogToolbarComponent]
})
export class DialogToolbarModule {}
