import { CommonModule } from '@angular/common';
import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';
import { PresentationModeProvider } from '@cme2/shared';

import { AuthService, IsAuthenticatedGuard } from './auth';
import { GlobalErrorHandler } from './global-error-handler';
import { httpInterceptorProviders } from './http-interceptors';
import { PresentationService } from './presentation';

@NgModule({
  imports: [CommonModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        httpInterceptorProviders,
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        PresentationService,
        { provide: PresentationModeProvider, useExisting: PresentationService },
        AuthService,
        IsAuthenticatedGuard
      ]
    };
  }
}
