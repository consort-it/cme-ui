import { Injectable } from '@angular/core';
import { GeneralMetadata, GitLabBackendService } from '@cme2/connector-gitlab';
import { normalizeServiceName } from '@cme2/rxjs-utils';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';

import { SolutionPaletteService } from '../../../shared';
import { Commit } from './commit';

const backendMetadataObjects2Commits = (backendMetadataObjects: Array<GeneralMetadata>): Array<Commit> =>
  backendMetadataObjects.map(metadata => ({
    id: (metadata as any)['short_id'] || '',
    message: metadata.message || '',
    committer: (metadata as any)['committer_name'] || '',
    date: new Date((metadata as any)['authored_date'] || '')
  }));

@Injectable()
export class LastCommitService {
  public readonly lastCommits$: Observable<Array<Commit>>;
  public readonly fetching$: Observable<boolean>;

  constructor(gitlabAdapter: GitLabBackendService, paletteService: SolutionPaletteService) {
    this.lastCommits$ = paletteService.microserviceNameSelection$.pipe(
      switchMap(selectedMicroserviceName => {
        if (!selectedMicroserviceName) {
          return of([]);
        }
        const normalizedServiceName = normalizeServiceName(selectedMicroserviceName);
        return gitlabAdapter.getMetadata(normalizedServiceName).pipe(map(backendMetadataObjects2Commits));
      })
    );
    this.fetching$ = this.lastCommits$.pipe(map(commits => commits.length === 0), startWith(true));
  }
}
