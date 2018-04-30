import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { ConnectorBaseModule } from '@cme2/connector-base';
import { ApiModule as ConnectorKubernetesModule } from '@cme2/connector-kubernetes';
import { ApiModule as ConnectorMetadataModule } from '@cme2/connector-metadata';

import { ConnectionChecker } from './cluster-manager';
import { ClusterManagerService } from './cluster-manager/cluster-manager.service';
import { ConnectionChangeService } from './connection-change';
import { KubernetesService } from './kubernetes/kubernetes.service';
import { MetaDataService } from './meta-data/meta-data.service';
import { NotificationService } from './notification';
import { LocalStorageService, StorageService } from './storage';

export const localStorageFactory = () => {
  return window.localStorage;
};

@NgModule({
  imports: [
    CommonModule,
    ConnectorBaseModule.forRoot(ClusterManagerService),
    ConnectorMetadataModule.forRoot(),
    ConnectorKubernetesModule.forRoot()
  ],
  providers: []
})
export class CoreServicesModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreServicesModule
  ) {
    if (parentModule) {
      throw new Error('CoreServicesModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreServicesModule,
      providers: [
        MetaDataService,
        KubernetesService,
        NotificationService,
        ConnectionChecker,
        ClusterManagerService,
        { provide: StorageService, useClass: LocalStorageService },
        { provide: ConnectionChangeService, useExisting: ClusterManagerService }
      ]
    };
  }
}
