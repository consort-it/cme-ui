import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MetadataProject, MetadataProjectPhase, MetaDataService, MetadataService } from '@cme2/core-services';

import { AddPhaseDialogComponent } from './add-phase-dialog/add-phase-dialog.component';
import { DragAndDropEvent } from './drag-and-drop';
import { SolutionPaletteService } from './shared';
import { SolutionTraceType } from './solution-trace/solution-trace.component';
import { AddServiceDialogComponent } from '@cme2/solution-view/src/add-service-dialog/add-service-dialog.component';

@Component({
  templateUrl: './solution-view.component.html',
  styleUrls: ['./solution-view.component.scss']
})
export class SolutionViewComponent implements OnInit {
  TraceType = SolutionTraceType;

  project: MetadataProject | null = null;

  public paletteVisible = false;

  constructor(
    private meta: MetaDataService,
    private dialog: MatDialog,
    private paletteService: SolutionPaletteService
  ) {}

  ngOnInit() {
    this.meta.currentProject$.subscribe((project: MetadataProject) => {
      this.project = project;
    });

    this.paletteService.microserviceSelection$.subscribe(selectedName => (this.paletteVisible = !!selectedName));
    this.paletteService.phaseSelection$.subscribe(selectedName => (this.paletteVisible = !!selectedName));
  }

  onPaletteVisibleChange(visible: boolean) {
    if (!visible) {
      this.paletteService.microserviceSelection = undefined;
      this.paletteService.phaseSelection = undefined;
    }
  }

  addNewPhase = () => {
    this.dialog.open(AddPhaseDialogComponent, {
      width: '400px',
      closeOnNavigation: false
    });
  };

  addNewService(phase: MetadataProjectPhase) {
    this.dialog.open(AddServiceDialogComponent, {
      width: '400px',
      closeOnNavigation: false,
      data: {
        phase
      }
    });
  }

  get phases(): MetadataProjectPhase[] {
    if (this.project) {
      return this.project.phases;
    }
    return [];
  }

  private updatePhases(phases: MetadataProjectPhase[]) {
    if (this.project) {
      this.project.phases = phases;
      this.meta.updateProject(this.project.id, this.project).subscribe((project: MetadataProject) => {
        this.project = project;
      });
    }
  }

  onPhaseDndDone(data: MetadataProjectPhase[]) {
    this.updatePhases(data);
  }

  microserviceDroppedBefore(event: DragAndDropEvent) {
    this.updateServicesAfterDragAndDrop(event, true);
  }
  microserviceDroppedAfter(event: DragAndDropEvent) {
    this.updateServicesAfterDragAndDrop(event, false);
  }

  private updateServicesAfterDragAndDrop(event: DragAndDropEvent, insertBefore = true) {
    if (this.project) {
      let droppedService: MetadataService | undefined;
      let tempPhases = [...this.project.phases];

      // Slice dropped service
      tempPhases = tempPhases.map(phase => {
        let services = [...phase.services];
        if (droppedService === undefined) {
          droppedService = services.find(service => service.name === event.droppedKey);
          services = services.filter(service => service.name !== event.droppedKey);
        }
        const newPhase = Object.assign({}, phase);
        newPhase.services = services;
        return newPhase;
      });

      if (droppedService === undefined) {
        // Error: dropped service not found
        return;
      }

      // Inserting dropped service at new position
      tempPhases = tempPhases.map(phase => {
        if (event.targetKey !== '') {
          const index = phase.services.findIndex((service: MetadataService) => service.name === event.targetKey);
          if (index > -1) {
            if (insertBefore) {
              phase.services.splice(index, 0, droppedService!);
            } else {
              phase.services.splice(index + 1, 0, droppedService!);
            }
          }
        } else {
          if (phase.name === event.targetPhase) {
            phase.services.push(droppedService!);
          }
        }
        return phase;
      });

      this.updatePhases(tempPhases);
    }
  }
}
