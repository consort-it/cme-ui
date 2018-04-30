import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApiModule as GitlabAdapterModule } from '@cme2/connector-gitlab';

import { LastCommitComponent } from './last-commit.component';
import { LastCommitService } from './last-commit.service';
import { MatProgressBarModule } from '@angular/material';
import { I18nModule } from '@cme2/i18n';

@NgModule({
  imports: [CommonModule, GitlabAdapterModule.forRoot(), MatProgressBarModule, I18nModule],
  declarations: [LastCommitComponent],
  exports: [LastCommitComponent],
  providers: [LastCommitService]
})
export class LastCommitModule {}
