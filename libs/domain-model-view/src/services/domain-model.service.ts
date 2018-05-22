import { first } from 'rxjs/operators/first';
import { DomainModelBackendService, DomainModel } from '@cme2/connector-domain-model';
import { MetaDataService, MetadataProject, NotificationService, NotificationType } from '@cme2/core-services';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { of } from 'rxjs/observable/of';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { filter } from 'rxjs/operators/filter';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { switchMap } from 'rxjs/operators/switchMap';

@Injectable()
export class DomainModelService {
  private domainModels$$: BehaviorSubject<DomainModel[]> = new BehaviorSubject<DomainModel[]>([]);
  private currentProject: MetadataProject | undefined;
  private modelBlacklist = ['tracepoint', 'errorresponse'];

  public colors = [
    // blue
    '#CFCFFF',
    '#4A4A9A',
    '#353575',
    '#201F50',
    // yellow
    '#FFC400',
    '#F6B108',
    '#ED9F11',
    '#E48C19',
    // red
    '#D42933',
    '#C3252F',
    '#B1212B',
    '#A01D27',
    // grey
    '#CED3D8',
    '#AFB6BD',
    '#9FA8B0',
    '#909AA3'
  ];

  constructor(
    private meta: MetaDataService,
    private domain: DomainModelBackendService,
    private notificationService: NotificationService
  ) {
    this.meta.currentServices$
      .pipe(
        withLatestFrom(this.meta.currentProject$),
        mergeMap(([serviceNames, currentProject]: [string[], MetadataProject]) =>
          this.domain.getModelsForServices(currentProject.name, serviceNames)
        ),
        map(models => models.filter(model => !this.modelBlacklist.includes(model.name.toLowerCase()))),
        map(models => this.initialSort(models)),
        map(models => this.initialColors(models))
      )
      .subscribe(models => this.domainModels$$.next(models));
  }

  get domainModels$() {
    return this.domainModels$$.asObservable();
  }

  get domainModels() {
    return this.domainModels$$.value;
  }

  private initialSort = (models: DomainModel[]) => {
    const needsInitialSorting = models.filter(model => model.positionX !== undefined).length === 0;
    if (needsInitialSorting) {
      this.solitaireCardSort(models);
      this.updateModels(models);
    }
    return models;
  };

  private initialColors = (models: DomainModel[]) => {
    const needsInitialColoring = models.filter(model => model.headerColor !== undefined).length === 0;
    if (needsInitialColoring) {
      const len = models.length;
      let currentColor = 0;
      const numberOfColors = this.colors.length;

      models.forEach((model, i) => {
        model.headerColor = this.colors[currentColor];
        if (i + 1 < len) {
          if (models[i + 1].serviceName !== model.serviceName) {
            currentColor++;
            if (currentColor > numberOfColors) {
              currentColor = 0;
            }
          }
        }
      });

      this.updateModels(models);
    }
    return models;
  };

  resetLayout() {
    this.solitaireCardSort(this.domainModels);
    this.updateModels(this.domainModels);
  }

  private solitaireCardSort = (models: DomainModel[]) => {
    let x = 20;
    let y = 20;
    let zIndex = 0;

    const initialY = 20;
    const offsetX = 300;
    const offsetY = 60;

    const len = models.length;

    models.forEach((model, i) => {
      model.positionX = x;
      model.positionY = y;
      model.zIndex = zIndex;

      if (i + 1 < len) {
        if (models[i + 1].serviceName === model.serviceName) {
          y += offsetY;
          x += 20;
        } else {
          x += offsetX;
          y = initialY;
        }
      }

      zIndex++;
    });
  };

  updateModel(model: DomainModel) {
    // this.domainModels$$.next(
    //   this.domainModels$$.value.map(m => {
    //     if (m.id === model.id) {
    //       return { ...m };
    //     }
    //     return m;
    //   })
    // );

    this.meta.currentProject$
      .pipe(
        first(),
        switchMap(project => {
          return this.domain.saveModelAppearance(project.name, [], this.domainModels$$.value).pipe(first());
        })
      )
      .subscribe(
        () => {},
        err => {
          this.notificationService.addNotification('Error', err, NotificationType.Alert);
        }
      );
  }

  updateModels(models: DomainModel[]) {
    this.domainModels$$.next(models);

    this.meta.currentProject$
      .pipe(
        first(),
        switchMap(project => {
          return this.domain.saveModelAppearance(project.name, [], models).pipe(first());
        })
      )
      .subscribe(
        () => {},
        err => {
          this.notificationService.addNotification('Error', err, NotificationType.Alert);
        }
      );
  }
}
