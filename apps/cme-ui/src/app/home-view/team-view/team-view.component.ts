import { Component, OnInit, Input } from '@angular/core';
import {
  MetadataProject,
  MetadataServiceType,
  MetaDataPerson,
  MetaDataService,
  MetadataService
} from '@cme2/core-services';

const flatten = (list: any) => list.reduce((a: any, b: any) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

@Component({
  selector: 'cme-team-view',
  templateUrl: './team-view.component.html',
  styleUrls: ['./team-view.component.scss']
})
export class TeamViewComponent implements OnInit {
  @Input() project: MetadataProject | undefined;
  constructor() {}

  ngOnInit() {}

  get numBackendServices(): number {
    if (this.project) {
      return flatten(this.project.phases.map(phase => phase.services)).filter(
        (service: any) => service.serviceType === MetadataServiceType.Backend
      ).length;
    }
    return 0;
  }
  get UIs(): MetadataService[] {
    if (this.project) {
      return flatten(this.project.phases.map(phase => phase.services)).filter(
        (service: any) => service.serviceType === MetadataServiceType.UI
      );
    }
    return [];
  }

  get developers(): MetaDataPerson[] {
    if (this.project) {
      return this.project.team.filter(member => member.roles.includes('Developer'));
    }
    return [];
  }

  get ops(): MetaDataPerson[] {
    if (this.project) {
      return this.project.team.filter(member => member.roles.includes('Operations'));
    }
    return [];
  }

  get productOwners(): MetaDataPerson[] {
    if (this.project) {
      return this.project.team.filter(member => member.roles.includes('Product Owner'));
    }
    return [];
  }
}
