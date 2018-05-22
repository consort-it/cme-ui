import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomainModelPaletteService } from '../services/domain-model-palette.service';
import { DomainModelService } from './../../services/domain-model.service';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'cme-domain-model-palette',
  templateUrl: './domain-model-palette.component.html',
  styleUrls: ['./domain-model-palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DomainModelPaletteComponent {
  constructor(public paletteService: DomainModelPaletteService, public domainModelService: DomainModelService) {}

  resetLayout() {
    this.domainModelService.resetLayout();
  }

  setColor(color: string) {
    this.paletteService.context$
      .pipe(
        first(),
        tap(model => {
          if (model) {
            model.headerColor = color;
            this.domainModelService.updateModel(model);
          }
        })
      )
      .subscribe();
  }
}
