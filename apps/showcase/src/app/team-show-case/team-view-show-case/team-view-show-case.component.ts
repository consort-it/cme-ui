import { Component, OnInit } from '@angular/core';
import { MetadataProject } from '@cme2/core-services';
import { dummyProject } from './dummyProject';

@Component({
  selector: 'cme-team-view-show-case',
  templateUrl: './team-view-show-case.component.html',
  styleUrls: ['./team-view-show-case.component.scss']
})
export class TeamViewShowCaseComponent implements OnInit {
  public project: MetadataProject = dummyProject;

  constructor() {}

  ngOnInit() {}
}
