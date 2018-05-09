import { Component, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cme-showcase',
  templateUrl: './showcase-app.component.html',
  styleUrls: ['./showcase-app.component.scss']
})
export class ShowcaseAppComponent {
  hasEndpoints = false;
  hasScopes = false;
  hasWorkers = false;
  hasDependencies = false;
  hasPersistence = false;
  hasKPIs = false;
  hasFeatureToggles = false;

  constructor(translateService: TranslateService) {
    translateService.setDefaultLang('en');
  }
}
