import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@cme2/i18n';
import { ViewContainerModule } from '@cme2/shared';

import { NotLoggedInViewRoutingModule } from './not-logged-in-view-routing.module';
import { NotLoggedInViewComponent } from './not-logged-in-view.component';

@NgModule({
  imports: [CommonModule, NotLoggedInViewRoutingModule, ViewContainerModule, I18nModule],
  declarations: [NotLoggedInViewComponent]
})
export class NotLoggedInViewModule {}
