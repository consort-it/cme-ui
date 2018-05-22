import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomainModelPaletteService } from '../services/domain-model-palette.service';
import { DomainModelService } from './../../services/domain-model.service';
import { first, tap } from 'rxjs/operators';
import { DomainModel } from '@cme2/connector-domain-model';
import { LogService } from '@cme2/logging';
import { NotificationService, NotificationType } from '@cme2/core-services';

@Component({
  selector: 'cme-domain-model-palette',
  templateUrl: './domain-model-palette.component.html',
  styleUrls: ['./domain-model-palette.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DomainModelPaletteComponent {
  constructor(
    public paletteService: DomainModelPaletteService,
    public domainModelService: DomainModelService,
    private logger: LogService,
    private notifications: NotificationService
  ) {}

  resetLayout() {
    this.domainModelService.resetLayout();
  }

  onSelectColor(color: string) {
    this.updateModelInternal(model => (model.headerColor = color));
  }

  onSelectIconName(iconName: string | undefined) {
    this.updateModelInternal(model => (model.iconName = iconName));
  }

  private updateModelInternal(modifierFunc: (model: DomainModel) => void) {
    this.paletteService.context$
      .pipe(
        first(),
        tap(model => {
          if (model) {
            modifierFunc(model);
            this.domainModelService.updateModel(model);
          }
        })
      )
      .subscribe(
        model => {
          this.logger.debug('Updated model successfully.', model);
        },
        err => {
          this.logger.error('Error updating model', err);
          this.notifications.addNotification(
            'Error updating model',
            'Could not update model: ' + err.toString(),
            NotificationType.Alert
          );
        }
      );
  }
}
