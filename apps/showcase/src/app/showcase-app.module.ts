import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatRadioModule,
  MatSlideToggleModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MetaDataService } from '@cme2/core-services';
import { I18nModule } from '@cme2/i18n';
import { LogService } from '@cme2/logging';
import { PresentationModeProvider, ViewContainerModule } from '@cme2/shared';
import {
  PaletteToolbarModule,
  SolutionMicroserviceModule,
  SolutionPaletteService,
  ServiceContextModule
} from '@cme2/solution-view';
import { NxModule } from '@nrwl/nx';
import { never } from 'rxjs/observable/never';
import { instance, mock, when } from 'ts-mockito';
import { QualityShowCaseModule } from './quality-show-case/quality-show-case.module';
import { PresentationModeFakeService } from './shared/presentation-mode-fake-service';
import { ShowcaseAppComponent } from './showcase-app.component';
import { SolutionMicroserviceShowCaseComponent } from './solution-microservice-show-case/solution-microservice-show-case.component';
import { TeamShowCaseModule } from './team-show-case/team-show-case.module';
import { DomainCardShowCaseComponent } from './domain-card-show-case/domain-card-show-case.component';
import { DomainCardModule } from '@cme2/domain-model-view/src/domain-card'; //tslint:disable-line

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NxModule.forRoot(),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    ViewContainerModule,
    MatCardModule,
    MatDialogModule,
    SolutionMicroserviceModule,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    MatSlideToggleModule,
    MatRadioModule,
    FormsModule,
    PaletteToolbarModule,
    TeamShowCaseModule,
    QualityShowCaseModule,
    ServiceContextModule,
    DomainCardModule,
    I18nModule.forRoot(),
    I18nModule.forChild() // we need this to actually load the translations
  ],
  declarations: [ShowcaseAppComponent, SolutionMicroserviceShowCaseComponent, DomainCardShowCaseComponent],
  bootstrap: [ShowcaseAppComponent],
  providers: [
    { provide: PresentationModeProvider, useClass: PresentationModeFakeService },
    LogService,
    {
      provide: SolutionPaletteService,
      useFactory: () => {
        const mockSolutionPaletteService = mock(SolutionPaletteService);
        when(mockSolutionPaletteService.microserviceSelection$).thenReturn(never());
        when(mockSolutionPaletteService.microserviceNameSelection$).thenReturn(never());
        return instance(mockSolutionPaletteService);
      }
    },
    {
      provide: MetaDataService,
      useFactory: () => {
        const mockMetaDataService = mock(MetaDataService);
        when(mockMetaDataService.currentProject$).thenReturn(never());
        return instance(mockMetaDataService);
      }
    }
  ]
})
export class ShowcaseAppModule {}
