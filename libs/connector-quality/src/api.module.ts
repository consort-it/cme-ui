import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { QualityBackendService } from './api/qualityBackend.service';

@NgModule({
  imports:      [],
  declarations: [],
  exports:      []
})
export class ApiModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: ApiModule,
            providers: [
    QualityBackendService ]
        }
    }

    constructor( @Optional() @SkipSelf() parentModule: ApiModule,
                 @Optional() http: HttpClient) {
        if (parentModule) {
            throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
        }
        if (!http) {
            throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
            'See also https://github.com/angular/angular/issues/20575');
        }
    }
}
