import { MetaDataService } from '@cme2/core-services';
import { SolutionPaletteService, SelectedPaletteTab } from './../shared/solution-palette.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cme-solution-bread-crumbs',
  templateUrl: './solution-bread-crumbs.component.html',
  styleUrls: ['./solution-bread-crumbs.component.scss']
})
export class SolutionBreadCrumbsComponent implements OnInit {
  projectName: string | undefined;
  phaseName: string | undefined;
  serviceName: string | undefined;
  private selectedTab: SelectedPaletteTab | undefined;

  constructor(private paletteService: SolutionPaletteService, private meta: MetaDataService) {}

  ngOnInit() {
    this.meta.currentProject$.subscribe(project => {
      this.projectName = project.name;
    });

    this.paletteService.tabSelection$.subscribe(selectedTab => {
      this.selectedTab = selectedTab;
    });

    this.paletteService.phaseSelection$.subscribe(phase => {
      this.phaseName = phase ? phase.name : undefined;
    });

    this.paletteService.microserviceSelection$.subscribe(service => {
      this.serviceName = service ? service.name : undefined;
    });
  }

  get showProjectCrumb(): boolean {
    return !!this.projectName;
  }

  get showPhaseCrumb(): boolean {
    return (
      !!this.phaseName &&
      (this.selectedTab === SelectedPaletteTab.Phase || this.selectedTab === SelectedPaletteTab.Service)
    );
  }

  get showServiceCrumb(): boolean {
    return !!this.serviceName && this.selectedTab === SelectedPaletteTab.Service;
  }
}
