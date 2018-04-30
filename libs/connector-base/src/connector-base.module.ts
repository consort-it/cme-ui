import { ModuleWithProviders, NgModule, Type } from '@angular/core';

import { HostnameService } from './hostname.service';

@NgModule({
  imports: []
})
export class ConnectorBaseModule {
  /**
   *
   * @param hostnameServiceType The type implementing abstract class HostnameService. Needs to be already registered in DI.
   */
  public static forRoot(hostnameServiceType: Type<HostnameService>): ModuleWithProviders {
    return {
      ngModule: ConnectorBaseModule,
      providers: [{ provide: HostnameService, useExisting: hostnameServiceType }]
    };
  }
}
