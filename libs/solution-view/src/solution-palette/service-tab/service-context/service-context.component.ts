import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog, MatIconRegistry } from '@angular/material';
import { MetaDataService, MetadataProject, MetadataService } from '@cme2/core-services';
import { _ } from '@cme2/i18n';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { EditListModalComponent } from './edit-list-modal/edit-list-modal.component';
import { ServiceContextService } from './service-context.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'cme-service-context',
  templateUrl: './service-context.component.html',
  styleUrls: ['./service-context.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ServiceContextService]
})
export class ServiceContextComponent implements OnInit {
  private currentProject: MetadataProject | undefined;

  constructor(
    private logger: LogService,
    private matDialog: MatDialog,
    private metadataService: MetaDataService,
    public contextService: ServiceContextService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.registerMaterialIcons();
    this.metadataService.currentProject$.subscribe(x => {
      this.currentProject = x;
    });
  }

  onDependencyEdit() {
    this.internalEdit(_('palette.service-tab.service-context.Dependencies'), 'dependencies');
  }

  onQueueEdit() {
    this.internalEdit(_('palette.service-tab.service-context.Message Queues'), 'messageQueue');
  }

  onPersistenceEdit() {
    this.internalEdit(_('palette.service-tab.service-context.Persistence'), 'persistence');
  }

  get persistenceItems(): Observable<string[]> {
    return this.getArrayFromMicroservicePropertyAsObservable('persistence');
  }

  get messageQueueItems(): Observable<string[]> {
    return this.getArrayFromMicroservicePropertyAsObservable('messageQueue');
  }

  get dependencyItems(): Observable<string[]> {
    return this.getArrayFromMicroservicePropertyAsObservable('dependencies');
  }

  private internalEdit(titleKey: string, propertyName: keyof MetadataService) {
    const initialValues = this.getArrayFromMicroserviceProperty(propertyName);
    const dialog = this.matDialog.open(EditListModalComponent, {
      width: '70%',
      data: { titleKey, initialValues }
    });
    dialog.afterClosed().subscribe(x => {
      if (x !== undefined && this.contextService.currentMicroservice) {
        this.contextService.currentMicroservice[propertyName] = x;
        this.metadataService.updateService(this.contextService.currentMicroservice).subscribe(project => {
          this.logger.debug(`Service '${this.contextService.currentMicroservice}' updated successfully`, project);
        });
      }
    });
  }

  private getArrayFromMicroservicePropertyAsObservable(propertyName: keyof MetadataService): Observable<string[]> {
    return this.contextService.currentMicroservice$.pipe(
      map(
        microservice =>
          microservice && microservice[propertyName] ? this.splitString2Array(microservice[propertyName]!) : []
      )
    );
  }

  private getArrayFromMicroserviceProperty(propertyName: keyof MetadataService): string[] {
    if (this.contextService.currentMicroservice && this.contextService.currentMicroservice[propertyName]) {
      return this.splitString2Array(this.contextService.currentMicroservice[propertyName]!);
    }
    return [];
  }

  private splitString2Array(stringWithCommas: string): string[] {
    return stringWithCommas.split(',');
  }

  private registerMaterialIcons() {
    this.matIconRegistry.addSvgIcon(
      'api',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/solution-view/context_api.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'dependencies',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/solution-view/context_dependencies.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'feature-toggles',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/solution-view/context_feature-toggles.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'job-workers',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/solution-view/context_job-workers.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'kpi',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/solution-view/context_kpi.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'persistence',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/solution-view/context_persistence.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'scopes',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/solution-view/context_scopes.svg')
    );
  }
}
