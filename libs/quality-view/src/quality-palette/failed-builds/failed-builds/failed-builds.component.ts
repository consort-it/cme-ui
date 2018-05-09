import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { QualityDetail, QualityStatus } from '@cme2/connector-quality';
import { Observable } from 'rxjs/Observable';
import { never } from 'rxjs/observable/never';
import { filter, map } from 'rxjs/operators';
import { QualityService } from '../../../services';

@Component({
  selector: 'cme-failed-builds',
  templateUrl: './failed-builds.component.html',
  styleUrls: ['./failed-builds.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FailedBuildsComponent implements OnInit {
  details$: Observable<QualityDetail[]>;

  constructor(private qualityService: QualityService) {
    this.details$ = never();
  }

  ngOnInit() {
    this.details$ = <Observable<QualityDetail[]>>this.qualityService.buildQuality$.pipe(
      map(x => x.details),
      filter(x => x !== undefined && x.length > 0)
    );
  }

  getIconName(status: QualityStatus.StatusEnum): string {
    switch (status) {
      case QualityStatus.StatusEnum.Failed:
        return 'error';
      case QualityStatus.StatusEnum.Warning:
        return 'warning';
      case QualityStatus.StatusEnum.Passed:
        return 'check';
      default:
        return 'not_interested';
    }
  }

  getColor(status: QualityStatus.StatusEnum): string {
    switch (status) {
      case QualityStatus.StatusEnum.Failed:
        return 'red';
      case QualityStatus.StatusEnum.Warning:
        return 'goldenrod';
      case QualityStatus.StatusEnum.Passed:
        return 'green';
      default:
        return 'grey';
    }
  }
}
