import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QualityStatus } from '@cme2/connector-quality';
import { TranslateService } from '@ngx-translate/core';
import { QualityPaletteService } from '../quality-palette';
import { QualityService } from '../services/quality.service';

@Component({
  selector: 'cme-quality-dashboard',
  templateUrl: './quality-dashboard.component.html',
  styleUrls: ['./quality-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QualityDashboardComponent {
  Category = QualityStatus.CategoryEnum;

  constructor(
    public qualityService: QualityService,
    public qualityPalette: QualityPaletteService,
    public translate: TranslateService
  ) {}
}
