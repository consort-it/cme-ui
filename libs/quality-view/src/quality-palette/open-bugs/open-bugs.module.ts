import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material';
import { OpenBugsService } from './open-bugs.service';
import { OpenBugsComponent } from './open-bugs/open-bugs.component';
import { I18nModule } from '@cme2/i18n';

@NgModule({
  imports: [CommonModule, MatProgressBarModule, I18nModule],
  declarations: [OpenBugsComponent],
  exports: [OpenBugsComponent],
  providers: [OpenBugsService]
})
export class OpenBugsModule {}
