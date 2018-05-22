import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DomainModelPaletteService } from '../services/domain-model-palette.service';

@Component({
  selector: 'cme-domain-model-bread-crumbs',
  templateUrl: './domain-model-bread-crumbs.component.html',
  styleUrls: ['./domain-model-bread-crumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DomainModelBreadCrumbsComponent {
  constructor(public paletteService: DomainModelPaletteService) {}
}
