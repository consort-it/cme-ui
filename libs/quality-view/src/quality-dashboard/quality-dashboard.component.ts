import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QualityService } from '../services/quality.service';

@Component({
  selector: 'cme-quality-dashboard',
  templateUrl: './quality-dashboard.component.html',
  styleUrls: ['./quality-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [QualityService]
})
export class QualityDashboardComponent {
  constructor(public qualityService: QualityService) {}
}
