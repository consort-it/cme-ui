import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { Component, OnInit } from '@angular/core';

import { SolutionPaletteService, SelectedPaletteTab } from './../shared/';
import { ClusterManagerService } from '@cme2/core-services';

@Component({
  selector: 'cme-solution-palette',
  templateUrl: './solution-palette.component.html',
  styleUrls: ['./solution-palette.component.scss']
})
export class SolutionPaletteComponent implements OnInit {
  constructor(public paletteService: SolutionPaletteService, public clusterManager: ClusterManagerService) {}

  phaseSelected = false;
  serviceSelected = false;

  private _selectedTab = SelectedPaletteTab.Project;

  ngOnInit() {
    this.paletteService.tabSelection$.pipe(distinctUntilChanged()).subscribe(selection => {
      this._selectedTab = selection;
    });

    this.paletteService.microserviceSelection$.subscribe(microservice => {
      this.serviceSelected = !!microservice;
    });

    this.paletteService.phaseSelection$.subscribe(phase => {
      this.phaseSelected = !!phase;
    });
  }

  onSelectedIndexChanged(selectedIndex: number) {
    this.paletteService.tabSelection = selectedIndex;
  }

  get selectedTab(): number {
    switch (this._selectedTab) {
      case SelectedPaletteTab.Project:
        return 0;
      case SelectedPaletteTab.Phase:
        return 1;
      case SelectedPaletteTab.Service:
        return 2;
    }
    return 0;
  }
}
