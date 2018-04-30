import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MetaDataService, MetadataProject, MetadataService, MetadataServiceType } from '@cme2/core-services';
import { Subject } from 'rxjs/Subject';
import { first, takeUntil } from 'rxjs/operators';
import { SolutionPaletteService } from '../shared';

@Component({
  selector: 'cme-add-service-dialog',
  templateUrl: './add-service-dialog.component.html',
  styleUrls: ['./add-service-dialog.component.scss']
})
export class AddServiceDialogComponent implements OnInit, OnDestroy {
  public currentPhaseName: string | undefined;
  private _destroy$$ = new Subject<void>();
  currentProject: MetadataProject | undefined;
  errorMessage: string | undefined;
  MetadataServiceType = MetadataServiceType;

  serviceType = MetadataServiceType.Backend;
  serviceUrl?: string;

  // get serviceNames(): string[] {
  //   if (this.currentProject) {
  //     const serviceNames: string[] = [];
  //     this.currentProject.phases.map(phase => phase.services).forEach((services: MetadataService[]) => {
  //       services.forEach(service => {
  //         serviceNames.push(service.name);
  //       });
  //     });
  //     return serviceNames;
  //   }
  //   return [];
  // }

  constructor(
    public metadataService: MetaDataService,
    private palette: SolutionPaletteService,
    private dialogRef: MatDialogRef<AddServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit() {
    this.metadataService.currentProject$.pipe(takeUntil(this._destroy$$)).subscribe(project => {
      this.currentProject = project;
    });

    if (this.data && this.data.phase) {
      this.currentPhaseName = this.data.phase.name;
    }
  }

  ngOnDestroy() {
    this._destroy$$.next();
  }

  submit(newServiceProps: { [key: string]: string }) {
    if (this.currentProject) {
      const service: MetadataService = {
        serviceType: newServiceProps.serviceType as MetadataServiceType,
        name: newServiceProps.serviceName,
        url: newServiceProps.serviceUrl
      };

      this.metadataService
        .addService(service.name, service.serviceType, this.currentPhaseName, service.url)
        .pipe(first())
        .subscribe(
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
