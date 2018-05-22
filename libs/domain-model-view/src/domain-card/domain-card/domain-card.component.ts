import { Component, Input, ChangeDetectionStrategy, OnInit } from '@angular/core';

import { PropertyInfo, DomainModel } from '@cme2/connector-domain-model';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { LogService } from '@cme2/logging';

@Component({
  selector: 'cme-domain-card',
  templateUrl: './domain-card.component.html',
  styleUrls: ['./domain-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DomainCardComponent implements OnInit {
  @Input()
  domainModel: DomainModel = {
    id: '',
    name: '',
    iconName: 'block',
    serviceName: '',
    headerColor: '',
    properties: []
  };

  @Input() selected = false;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private logger: LogService
  ) {}

  ngOnInit() {
    this.registerMaterialIcons();
  }

  get headerClass() {
    return 'color-' + this.domainModel.headerColor;
  }

  private registerMaterialIcons() {
    this.matIconRegistry.addSvgIcon(
      'array',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/domain-model-view/domain-array.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'required',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/domain-model-view/domain-required.svg')
    );
  }
}
