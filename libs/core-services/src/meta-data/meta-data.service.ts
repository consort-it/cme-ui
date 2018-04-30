import { Injectable } from '@angular/core';
import { Project as BackendProject, ProjectService } from '@cme2/connector-metadata';
import { LogService } from '@cme2/logging';
import { genericRetryStrategy } from '@cme2/rxjs-utils';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, first, map, mapTo, retryWhen, tap } from 'rxjs/operators';
import { take } from 'rxjs/operators/take';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { StorageService } from '../storage';
import { MetadataProject, MetadataProjectPhase, MetadataService } from './model';
import { MetadataServiceType } from './model/meta-data-service-type.enum';

const KEY_CME2_CURRENT_PROJECT = 'cme2.currentProject';

@Injectable()
export class MetaDataService {
  private _currentProject$$ = new ReplaySubject<MetadataProject>(1);
  private _currentProject: MetadataProject | undefined;

  constructor(
    private projectService: ProjectService,
    private storageService: StorageService,
    private logger: LogService
  ) {
    this._currentProject$$.subscribe(x => (this._currentProject = x));
    this.loadCurrentProjectFromLocalStorage();
  }

  private loadCurrentProjectFromLocalStorage() {
    const value = this.storageService.getItem(KEY_CME2_CURRENT_PROJECT);
    if (value) {
      const project: BackendProject = JSON.parse(value);
      this.getProjects()
        .pipe(take(1))
        .subscribe((projects: BackendProject[]) => {
          const filtered = projects.filter(p => p.id === project.id);
          if (filtered.length === 1) {
            this._currentProject$$.next(this.mapBackendProject2Project(filtered[0]));
          }
        });
    }
  }

  isBackendReachable(): Observable<boolean> {
    return this.projectService.getProjects().pipe(
      first(),
      mapTo(true),
      catchError((err, caught) => {
        return of(false).pipe(first());
      })
    );
  }

  getProjects(): Observable<MetadataProject[]> {
    return this.projectService.getProjects().pipe(
      map((backendProjects: BackendProject[]) => {
        return backendProjects.map(this.mapBackendProject2Project);
      }),
      retryWhen(
        genericRetryStrategy({
          maxRetryAttempts: 3,
          scalingDuration: 1000
        })
      )
    );
  }

  setCurrentProject(project: MetadataProject) {
    this.storageService.setItem(KEY_CME2_CURRENT_PROJECT, JSON.stringify(this.mapProject2BackendProject(project)));
    this._currentProject$$.next(project);
  }

  get currentProject$(): Observable<MetadataProject> {
    return this._currentProject$$.asObservable();
  }

  get currentServices$(): Observable<string[]> {
    return this.currentProject$.pipe(
      map(project => {
        if (project) {
          const serviceNames: string[] = [];
          project.phases.map(phase => phase.services).forEach((services: MetadataService[]) => {
            services.forEach(service => {
              serviceNames.push(service.name);
            });
          });
          return serviceNames;
        }
        return [];
      })
    );
  }

  public updateProject(id: string, body: MetadataProject): Observable<MetadataProject> {
    return this.projectService
      .updateProject(id, this.mapProject2BackendProject(body))
      .pipe(map(this.mapBackendProject2Project), tap(project => this.setCurrentProject(project)));
  }

  public deleteService(serviceName: string): Observable<MetadataProject> {
    if (!this._currentProject) {
      throw new Error(`Cannot delete service '${serviceName}' because current project is not initialized.`);
    }
    const tempProject = { ...this._currentProject };

    tempProject.phases = [...tempProject.phases]; //NOSONAR
    const phase: MetadataProjectPhase | undefined = tempProject.phases.find(
      pse => pse.services.find(svc => svc.name === serviceName) !== undefined
    );

    if (phase) {
      phase.services = phase.services.filter(svc => svc.name !== serviceName);
    } else {
      const message = `Cannot delete service '${serviceName}' because it does not exist in the current project '${
        this._currentProject.name
      }'`;
      this.logger.error(message, this._currentProject);
      throw new Error(message);
    }

    return this.updateProject(this._currentProject.id, tempProject).pipe(first());
  }

  public addService(
    serviceName: string,
    serviceType: MetadataServiceType,
    phaseName?: string,
    serviceUrl?: string
  ): Observable<MetadataProject> {
    if (!this._currentProject) {
      throw new Error(`Cannot add service '${serviceName}' because current project is not initialized.`);
    }
    const newService: MetadataService = { name: serviceName, serviceType, url: serviceUrl };

    const tempProject = { ...this._currentProject };
    tempProject.phases = [...tempProject.phases]; //NOSONAR
    let phase: MetadataProjectPhase = tempProject.phases[tempProject.phases.length - 1];

    if (phaseName) {
      phase = tempProject.phases.find(pse => pse.name === phaseName) || phase;
    }

    phase.services.push(newService);
    return this.updateProject(this._currentProject.id, tempProject).pipe(first());
  }

  private mapBackendProject2Project(backendProject: BackendProject): MetadataProject {
    return <MetadataProject>{
      ...backendProject
    };
  }

  private mapProject2BackendProject(project: MetadataProject): BackendProject {
    return {
      ...project
    };
  }
}
