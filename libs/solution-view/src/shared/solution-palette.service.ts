import { MetadataService, MetadataProjectPhase, MetaDataService, MetadataProject } from '@cme2/core-services';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

export type SelectedMicroservice = MetadataService | undefined;
export type SelectedMicroserviceName = string | undefined;
export type SelectedPhase = MetadataProjectPhase | undefined;
export type SelectedPhaseName = string | undefined;

export enum SelectedPaletteTab {
  Project,
  Phase,
  Service
}

@Injectable()
export class SolutionPaletteService {
  private currentProject: MetadataProject | undefined;

  private microserviceSelection$$ = new BehaviorSubject<SelectedMicroservice>(undefined);
  public readonly microserviceSelection$: Observable<SelectedMicroservice>;
  public readonly microserviceNameSelection$: Observable<SelectedMicroserviceName>;

  private phaseSelection$$ = new BehaviorSubject<SelectedPhase>(undefined);
  public readonly phaseSelection$: Observable<SelectedPhase>;

  private tabSelection$$ = new BehaviorSubject<SelectedPaletteTab>(SelectedPaletteTab.Project);
  public readonly tabSelection$: Observable<SelectedPaletteTab>;

  constructor(private meta: MetaDataService) {
    this.microserviceSelection$ = this.microserviceSelection$$.asObservable();
    this.phaseSelection$ = this.phaseSelection$$.asObservable();
    this.tabSelection$ = this.tabSelection$$.asObservable();

    this.microserviceNameSelection$ = this.microserviceSelection$$.asObservable().pipe(
      map(service => {
        if (service) {
          return service.name;
        }
        return undefined;
      })
    );

    this.meta.currentProject$.subscribe(currentProject => {
      this.currentProject = currentProject;
    });
  }

  /**
   * Set the currently selected microservice
   * @param value: name of the currently selected microservice or `undefined` if none is selected.
   */
  public set microserviceSelection(value: MetadataService | undefined) {
    this.microserviceSelection$$.next(value);

    if (value) {
      if (this.currentProject) {
        this.currentProject.phases.forEach(phase => {
          if (phase.services.find(service => service.name === value.name)) {
            this.phaseSelection$$.next(phase);
            return;
          }
        });
      }
    } else {
      this.phaseSelection$$.next(undefined);
    }
  }

  public get microserviceSelection(): SelectedMicroservice {
    return this.microserviceSelection$$.value;
  }

  /**
   * Set the currently selected phase
   * @param value: name of the currently selected phase or `undefined` if none is selected.
   */
  public set phaseSelection(value: MetadataProjectPhase | undefined) {
    this.phaseSelection$$.next(value);
  }

  public get phaseSelection(): SelectedPhase {
    return this.phaseSelection$$.value;
  }

  /**
   * Set the currently tab in the palette view
   * @param value: enum value of the current selected tab inside the palette tab view
   */
  public set tabSelection(value: SelectedPaletteTab) {
    this.tabSelection$$.next(value);
  }

  public get tabSelection(): SelectedPaletteTab {
    return this.tabSelection$$.value;
  }
}
