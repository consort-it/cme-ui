import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatSidenavModule, MatTooltipDefaultOptions } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreServicesModule } from '@cme2/core-services';
import { I18nModule } from '@cme2/i18n';
import { LoggingModule } from '@cme2/logging';
import { genericRetryStrategy, genericRetryStrategyToken } from '@cme2/rxjs-utils';
import { NxModule } from '@nrwl/nx';

import { AppRoutingModule } from './app-routing.module';
import { AppRoutingService } from './app-routing.service';
import { AppComponent } from './app.component';
import { ClusterManagerModule } from './cluster-manager/cluster-manager.module';
import { FooterModule } from './footer';
import { HeaderModule } from './header';
import { LoginModule } from './login';
import { MainAreaModule } from './main-area';
import { PresentationProgressBarModule } from './presentation-progress-bar';
import { SharedModule } from './shared';

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 300,
  hideDelay: 300,
  touchendHideDelay: 300
};

const useMock = true;

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSidenavModule,
    NxModule.forRoot(),
    AppRoutingModule,
    SharedModule.forRoot(),
    HeaderModule,
    FooterModule,
    LoginModule,
    MainAreaModule,
    CoreServicesModule.forRoot(),
    PresentationProgressBarModule,
    ClusterManagerModule.forRoot(),
    LoggingModule.forRoot(),
    I18nModule.forRoot()
  ],
  declarations: [AppComponent],
  providers: [
    AppRoutingService,
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults },
    { provide: genericRetryStrategyToken, useValue: genericRetryStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
