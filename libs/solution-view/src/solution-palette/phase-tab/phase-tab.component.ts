import { SolutionPaletteService } from './../../shared/solution-palette.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddPhaseDialogComponent } from '@cme2/solution-view/src/add-phase-dialog/add-phase-dialog.component';
import { MetaDataService, MetadataProjectPhase, MetadataProject } from '@cme2/core-services';

@Component({
  selector: 'cme-phase-tab',
  templateUrl: './phase-tab.component.html',
  styleUrls: ['./phase-tab.component.scss']
})
export class PhaseTabComponent implements OnInit {
  selectedPhase: MetadataProjectPhase | undefined;
  deleteDisabled = true;
  currentProject: MetadataProject | undefined;

  constructor(
    private dialog: MatDialog,
    private paletteService: SolutionPaletteService,
    private meta: MetaDataService
  ) {
    this.meta.currentProject$.subscribe(currentProject => {
      this.currentProject = currentProject;
    });

    this.paletteService.phaseSelection$.subscribe(selectedPhase => {
      this.selectedPhase = selectedPhase;

      if (this.selectedPhase) {
        this.deleteDisabled = this.selectedPhase.services.length !== 0;
      } else {
        this.deleteDisabled = true;
      }
    });
  }

  ngOnInit() {}

  addNewPhase() {
    this.dialog.open(AddPhaseDialogComponent, {
      width: '400px',
      closeOnNavigation: false
    });
  }

  deletePhase() {
    if (this.selectedPhase && this.currentProject) {
      const tempProject = { ...this.currentProject };
      tempProject.phases = tempProject.phases.filter(phase => phase.name !== this.selectedPhase!.name);

      this.meta.updateProject(this.currentProject.id, tempProject).subscribe(
        () => {
          this.paletteService.phaseSelection = undefined;
        },
        err => {
          // TODO: where to display error messages in palette?
        }
      );
    }
  }
}
