import { never } from 'rxjs/observable/never';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  ClusterManagerService,
  K8sService,
  K8sServiceStatus,
  KubernetesService,
  MetadataService,
  MetaDataService,
  MetadataServiceType
} from '@cme2/core-services';
import { SolutionPaletteService, JiraService } from '@cme2/solution-view';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { anything, instance, mock, when } from 'ts-mockito';

const kubernetesService$$ = new Subject<K8sService>();

export function createMockClusterManagerService(): ClusterManagerService {
  const mockClusterManagerService = mock(ClusterManagerService);
  when(mockClusterManagerService.currentConnection$).thenReturn(
    of({ id: '123', hostname: 'http://localhost:4200', namespace: 'test', environment: 'test' })
  );
  return instance(mockClusterManagerService);
}

export function createMockKubernetesService(): KubernetesService {
  const mockKubernetesService = mock(KubernetesService);
  when(mockKubernetesService.getService(anything(), anything())).thenReturn(kubernetesService$$);
  return instance(mockKubernetesService);
}

export function createMockJiraService(): JiraService {
  const mockJiraService = mock(JiraService);
  when(mockJiraService.getIssuesByTag(anything())).thenReturn(of([]));
  return instance(mockJiraService);
}

export function createMockMetaDataService(): MetaDataService {
  const mockMetaService = mock(MetaDataService);
  when(mockMetaService.currentProject$).thenReturn(never());
  return instance(mockMetaService);
}

@Component({
  selector: 'cme-solution-microservice-show-case',
  templateUrl: './solution-microservice-show-case.component.html',
  styleUrls: ['./solution-microservice-show-case.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SolutionPaletteService,
    { provide: MetaDataService, useFactory: createMockMetaDataService },
    { provide: ClusterManagerService, useFactory: createMockClusterManagerService },
    { provide: KubernetesService, useFactory: createMockKubernetesService },
    { provide: JiraService, useFactory: createMockJiraService }
  ]
})
export class SolutionMicroserviceShowCaseComponent {
  public readonly kubeInfoRunning: K8sService = {
    name: '',
    version: '123 test',
    status: K8sServiceStatus.Running,
    instances: 1
  };

  public readonly kubeInfoBroken: K8sService = {
    name: '',
    version: '123 test',
    status: K8sServiceStatus.Broken,
    instances: 1
  };

  public serviceModel: MetadataService = {
    name: 'testService',
    description: 'Garstig Kastrat',
    serviceType: MetadataServiceType.Backend
  };

  public K8sServiceStatus = K8sServiceStatus;
  constructor(public paletteService: SolutionPaletteService) {}

  onStateChange(event: any) {
    kubernetesService$$.next(event.value);
  }

  onSelect(event: any) {
    this.paletteService.microserviceSelection = event.checked ? this.serviceModel : undefined;
  }
}
