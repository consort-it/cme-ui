import { Component } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { FeatureToggle } from './feature-toggle';
import { FeatureToggleService } from './feature-toggle.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'cme-feature-toggle',
  templateUrl: './feature-toggle.component.html',
  styleUrls: ['./feature-toggle.component.scss']
})
export class FeatureToggleComponent {
  constructor(public readonly featureToggleService: FeatureToggleService) {}

  onToggle(event: MatSlideToggleChange, featureToggle: FeatureToggle) {
    this.featureToggleService.setFeatureToggle(
      featureToggle.serviceName,
      featureToggle.environment,
      featureToggle.toggleName,
      event.checked
    );
  }
}
