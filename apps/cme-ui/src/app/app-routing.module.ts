import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CurrentConnectionGuard } from './cluster-manager/current-connection.guard';
import { NoClusterConnectionsComponent } from './cluster-manager/no-cluster-connections';
import { IsAuthenticatedGuard } from './shared';
import { MetadataGuard } from './cluster-manager/metadata.guard';

const routes: Routes = [
  {
    path: 'not-logged-in',
    loadChildren: './not-logged-in-view/not-logged-in-view.module#NotLoggedInViewModule'
  },
  {
    path: 'cluster-not-reachable',
    loadChildren: './cluster-not-reachable-view/cluster-not-reachable-view.module#ClusterNotReachableViewModule'
  },
  {
    path: '',
    canActivate: [IsAuthenticatedGuard],
    data: { containsPresentationModePages: true },
    children: [
      {
        path: 'setupclusterconnection',
        component: NoClusterConnectionsComponent
      },
      {
        path: '',
        canActivate: [CurrentConnectionGuard],
        data: { containsPresentationModePages: true },
        children: [
          {
            path: 'home',
            loadChildren: './home-view/home-view.module#HomeViewModule',
            data: { shouldShowInPresentationMode: true, pageName: 'home' },
            canActivate: [MetadataGuard]
          },
          {
            path: 'solution',
            loadChildren: '@cme2/solution-view#SolutionViewModule',
            data: { shouldShowInPresentationMode: true, pageName: 'solution' },
            canActivate: [MetadataGuard]
          },
          {
            path: 'domain-model',
            loadChildren: '@cme2/domain-model-view#DomainModelViewModule',
            data: { shouldShowInPresentationMode: true, pageName: 'domain-model' },
            canActivate: [MetadataGuard]
          },
          {
            path: 'cost',
            loadChildren: '@cme2/cost-view#CostViewModule',
            data: { shouldShowInPresentationMode: true, pageName: 'cost' },
            canActivate: [MetadataGuard]
          },
          {
            path: 'quality',
            loadChildren: '@cme2/quality-view#QualityViewModule',
            data: { shouldShowInPresentationMode: true, pageName: 'quality' },
            canActivate: [MetadataGuard]
          },
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full',
            canActivate: [MetadataGuard]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
