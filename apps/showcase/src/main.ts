import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ShowcaseAppModule } from './app/showcase-app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(ShowcaseAppModule)
  .catch(err => console.log(err)); // tslint:disable-line:no-console
