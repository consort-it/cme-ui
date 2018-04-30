import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@cme2/i18n';
import { ViewContainerModule } from '@cme2/shared';
import { ClusterNotReachableViewComponent } from './cluster-not-reachable-view.component';
import { ClusterNotReachableViewRoutingModule } from './cluster-not-reachable-view-routing.module';

@NgModule({
  imports: [CommonModule, ClusterNotReachableViewRoutingModule, ViewContainerModule, I18nModule],
  declarations: [ClusterNotReachableViewComponent]
})
export class ClusterNotReachableViewModule {}
