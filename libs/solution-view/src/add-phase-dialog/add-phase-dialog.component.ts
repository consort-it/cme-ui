import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MetadataProject, MetaDataService } from '@cme2/core-services';

@Component({
  selector: 'cme-add-phase-dialog',
  templateUrl: './add-phase-dialog.component.html',
  styleUrls: ['./add-phase-dialog.component.scss']
})
export class AddPhaseDialogComponent implements OnInit {
  currentProject: MetadataProject | undefined;
  errorMessage: string | undefined;

  get phaseNames(): string[] {
    if (this.currentProject) {
      return this.currentProject.phases.map(phase => phase.name);
    }
    return [];
  }

  constructor(private metadataService: MetaDataService, public dialogRef: MatDialogRef<AddPhaseDialogComponent>) {}

  ngOnInit() {
    this.metadataService.currentProject$.subscribe(project => {
      this.currentProject = project;
    });
  }

  submit(newPhaseName: string) {
    if (this.currentProject) {
      const newPhase = { name: newPhaseName, services: [] };

      const tempProject = { ...this.currentProject };
      tempProject.phases = [...tempProject.phases]; // NOSONAR
      tempProject.phases.push(newPhase);

      this.metadataService.updateProject(this.currentProject.id, tempProject).subscribe(
        () => {
          this.dialogRef.close();
        },
        err => {
          this.errorMessage = err;
        }
      );
    }
  }
}
