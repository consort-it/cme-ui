import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogService, MockLogService } from './logging';

@NgModule({
  imports: [CommonModule]
})
export class LoggingModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: LoggingModule,
      providers: [LogService]
    };
  }

  public static forMocking(): ModuleWithProviders {
    return {
      ngModule: LoggingModule,
      providers: [{ provide: LogService, useClass: MockLogService }]
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: LoggingModule
  ) {
    if (parentModule) {
      throw new Error('LoggingModule is already loaded. Import it in the AppModule only');
    }
  }
}
