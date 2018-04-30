import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatCheckboxModule, MatRadioModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { I18nModule } from '@cme2/i18n';
import { LogService } from '@cme2/logging';
import { PresentationModeProvider, ViewContainerModule } from '@cme2/shared';
import { SolutionMicroserviceModule } from '@cme2/solution-view';
import { NxModule } from '@nrwl/nx';

import { AppComponent } from './app.component';
import { PresentationModeFakeService } from './shared/presentation-mode-fake-service';
import { SolutionMicroserviceShowCaseComponent } from './solution-microservice-show-case/solution-microservice-show-case.component';
import { PaletteToolbarModule } from '@cme2/solution-view';
import { TeamShowCaseModule } from './team-show-case/team-show-case.module';
import { QualityShowCaseModule } from './quality-show-case/quality-show-case.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NxModule.forRoot(),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    ViewContainerModule,
    MatCardModule,
    SolutionMicroserviceModule,
    MatCheckboxModule,
    MatRadioModule,
    FormsModule,
    PaletteToolbarModule,
    TeamShowCaseModule,
    QualityShowCaseModule,
    I18nModule.forRoot(),
    I18nModule.forChild() // we need this to actually load the translations
  ],
  declarations: [AppComponent, SolutionMicroserviceShowCaseComponent],
  bootstrap: [AppComponent],
  providers: [{ provide: PresentationModeProvider, useClass: PresentationModeFakeService }, LogService]
})
export class AppModule {}
