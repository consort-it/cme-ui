import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClusterNotReachableViewComponent } from './cluster-not-reachable-view.component';

const routes: Routes = [{ path: '', component: ClusterNotReachableViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClusterNotReachableViewRoutingModule {}
