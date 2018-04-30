import { Component, OnInit } from '@angular/core';
import { MetaDataService, MetadataProject } from '@cme2/core-services';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cme-team-edit-tab',
  templateUrl: './team-edit-tab.component.html',
  styleUrls: ['./team-edit-tab.component.scss']
})
export class TeamEditTabComponent {
  public project$: Observable<MetadataProject>;

  constructor(public metadataService: MetaDataService) {
    this.project$ = this.metadataService.currentProject$.pipe(
      map(project => <MetadataProject>JSON.parse(JSON.stringify(project)))
    );
  }

  onProjectChange(project: MetadataProject) {
    this.metadataService.updateProject(project.id, project).subscribe();
  }
}
