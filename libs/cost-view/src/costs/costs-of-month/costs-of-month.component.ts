import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MonthOfYear } from '@cme2/shared';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators/first';
import { map } from 'rxjs/operators/map';

import { Cost } from '../shared/costs';
import { CostsService } from '../shared/costs.service';

@Component({
  selector: 'cme-costs-of-month',
  templateUrl: './costs-of-month.component.html',
  styleUrls: ['./costs-of-month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CostsOfMonthComponent {
  costs$ = new BehaviorSubject<Cost[]>([]);
  isRetrievingCosts$ = new BehaviorSubject<boolean>(true);
  noCostsFound$ = combineLatest(this.isRetrievingCosts$, this.costs$).pipe(
    map(([isRetrieving, costs]) => !isRetrieving && costs.length === 0)
  );

  @Input()
  set month(value: MonthOfYear) {
    this.costs$.next([]);
    this.isRetrievingCosts$.next(true);
    this.costsService
      .getCosts$(value)
      .pipe(first())
      .subscribe(costs => {
        this.isRetrievingCosts$.next(false);
        this.costs$.next(costs);
      });
  }

  constructor(private costsService: CostsService) {}
}
