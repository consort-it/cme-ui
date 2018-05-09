import { Injectable } from '@angular/core';
import { GitLabBackendService } from '@cme2/connector-gitlab';
import { MetaDataService, MetadataService } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { normalizeServiceName } from '@cme2/rxjs-utils';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';
import { catchError, filter, first, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { SolutionPaletteService } from '../../../shared/solution-palette.service';

const SCOPE_KEYWORD = ' scopes:';
const SWAGGER_FILE_NAME = 'swagger.yaml';

@Injectable()
export class ServiceContextService {
  public currentMicroservice$: Observable<MetadataService | undefined>;

  private _currentMicroservice: MetadataService | undefined;

  public get currentMicroservice(): MetadataService | undefined {
    return this._currentMicroservice;
  }

  public hasApiEndpoints$: Observable<boolean> = of(false);

  public hasScopes$: Observable<boolean> = of(false);

  constructor(
    private logger: LogService,
    private gitlabAdapter: GitLabBackendService,
    private metadataService: MetaDataService,
    private paletteService: SolutionPaletteService
  ) {
    this.currentMicroservice$ = combineLatest(
      this.metadataService.currentProject$,
      this.paletteService.microserviceNameSelection$
    ).pipe(
      map(values => {
        if (!values[1]) {
          return undefined;
        }

        let foundService: MetadataService | undefined;
        values[0].phases.map(phase => phase.services).forEach((services: MetadataService[]) => {
          services.forEach(service => {
            if (service.name === values[1]) {
              foundService = service;
            }
          });
        });
        return foundService;
      }),
      shareReplay()
    );

    this.paletteService.microserviceSelection$.subscribe(x => {
      this._currentMicroservice = x;
    });

    this.hasApiEndpoints$ = this.paletteService.microserviceNameSelection$.pipe(
      filter(x => !!x),
      switchMap(name => this.hasApiEndpoints(name!))
    );

    this.hasScopes$ = this.paletteService.microserviceNameSelection$.pipe(
      filter(x => !!x),
      switchMap(name => this.hasScopes(name!))
    );
  }

  public hasApiEndpoints(serviceName: string): Observable<boolean> {
    serviceName = normalizeServiceName(serviceName);
    return this.gitlabAdapter.getMetadataForFile(serviceName, SWAGGER_FILE_NAME, 1).pipe(
      first(),
      catchError(err => {
        this.logger.info(
          `Error while fetching swagger file metadata for service '${serviceName}', defaulting to no api endpoints`,
          err
        );
        return of([]);
      }),
      map(x => x.length > 0)
    );
  }

  public hasScopes(serviceName: string): Observable<boolean> {
    serviceName = normalizeServiceName(serviceName);
    // Note: it is necessary to give the REST client a hint that this response will contain
    // text/plain in the body. Otherwise it tries to parse JSON by default and fails...
    return this.gitlabAdapter.getFileAsString(serviceName, SWAGGER_FILE_NAME, 'body', 'text').pipe(
      first(),
      catchError(err => {
        this.logger.info(
          `Error while fetching swagger file contents for service '${serviceName}', defaulting to no scopes`,
          err
        );
        return of('');
      }),
      map(x => x.indexOf(SCOPE_KEYWORD) > -1)
    );
  }
}
