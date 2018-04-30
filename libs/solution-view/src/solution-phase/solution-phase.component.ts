import { Component, Input, OnInit } from '@angular/core';
import { ClusterManagerService, KubernetesService, MetadataProjectPhase, MetadataService } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { combineLatest } from 'rxjs/operators';

import { SolutionPaletteService, SelectedPaletteTab } from './../shared';
import { SolutionTraceType } from './../solution-trace/solution-trace.component';

@Component({
  selector: 'cme-solution-phase',
  templateUrl: './solution-phase.component.html',
  styleUrls: ['./solution-phase.component.scss']
})
export class SolutionPhaseComponent implements OnInit {
  TraceType = SolutionTraceType;

  phaseSelected = false;

  @Input() phase: MetadataProjectPhase | undefined;

  constructor(
    private logger: LogService,
    private clusterManager: ClusterManagerService,
    private kubernetesService: KubernetesService,
    private paletteService: SolutionPaletteService
  ) {}

  ngOnInit() {
    this.paletteService.phaseSelection$.subscribe(selectedPhase => {
      if (this.phase && selectedPhase) {
        this.phaseSelected = this.phase.name === selectedPhase.name;
      } else {
        this.phaseSelected = false;
      }
    });
  }

  get services(): MetadataService[] {
    return this.phase ? this.phase.services : [];
  }

  get phaseName(): string {
    return this.phase ? this.phase.name : '';
  }

  getTraceType(service: MetadataService): SolutionTraceType {
    const i = this.services.findIndex(s => s.name === service.name);
    const len = this.services.length;

    if (i === 0 && len === 1) {
      return SolutionTraceType.Horizontal;
    }
    if (i === 0 && len > 1) {
      return SolutionTraceType.HorizontalSouth;
    }
    if (len > 1 && i === len - 1) {
      return SolutionTraceType.HorizontalNorth;
    }
    return SolutionTraceType.HorizontalNorthSouth;
  }

  headerClicked() {
    if (this.phase) {
      this.paletteService.phaseSelection = this.phase;
      this.paletteService.tabSelection = SelectedPaletteTab.Phase;
    }
  }
}
