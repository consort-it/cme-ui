import { Component, OnInit } from '@angular/core';
import { MetaDataService, MetadataProject } from '@cme2/core-services';

@Component({
  selector: 'cme-context-tab',
  templateUrl: './context-tab.component.html',
  styleUrls: ['./context-tab.component.scss']
})
export class ContextTabComponent implements OnInit {
  diagram = '';
  project: MetadataProject | undefined;

  constructor(private meta: MetaDataService) {
    this.meta.currentProject$.subscribe(project => {
      if (project.context) {
        this.project = Object.assign({}, project);
        this.diagram = project.context;
      }
    });
  }

  ngOnInit() {}

  save(value: any) {
    if (this.project) {
      this.project.context = this.diagram;
      this.meta.updateProject(this.project.id, this.project).subscribe(() => {});
    }
  }
}
