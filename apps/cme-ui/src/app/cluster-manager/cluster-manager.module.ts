import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@cme2/i18n';
import { ViewContainerModule } from '@cme2/shared';
import { SharedModule } from '../shared';
import { ClusterManagerComponent } from './cluster-manager/cluster-manager.component';
import { CurrentConnectionGuard } from './current-connection.guard';
import { MetadataGuard } from './metadata.guard';
import { NewConnectionComponent } from './new-connection/new-connection.component';
import { NoClusterConnectionsComponent } from './no-cluster-connections/no-cluster-connections.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatRadioModule,
    RouterModule,
    MatIconModule,
    ViewContainerModule,
    I18nModule,
    SharedModule
  ],
  declarations: [ClusterManagerComponent, NewConnectionComponent, NoClusterConnectionsComponent],
  entryComponents: [ClusterManagerComponent]
})
export class ClusterManagerModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ClusterManagerModule,
      providers: [CurrentConnectionGuard, MetadataGuard]
    };
  }
}
