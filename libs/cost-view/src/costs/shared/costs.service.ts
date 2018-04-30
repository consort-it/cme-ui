import { Injectable } from '@angular/core';
import { AwsCostObject, AwsCosts, CostsService as ConnectorCostsService } from '@cme2/connector-aws-costs';
import { LogService } from '@cme2/logging';
import { MonthOfYear } from '@cme2/shared';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators/catchError';
import { first } from 'rxjs/operators/first';
import { map } from 'rxjs/operators/map';

import { Cost } from './costs';

const mockData: AwsCosts = [
  {
    resourceGroup: 'mock resource 1',
    year: 2018,
    month: 3,
    estimated: true,
    awsCosts: {
      amount: 123.3456,
      currency: 'USD'
    }
  },
  {
    resourceGroup: 'mock resource 2',
    year: 2018,
    month: 3,
    estimated: true,
    awsCosts: {
      amount: 0.354678,
      currency: 'USD'
    }
  },
  {
    resourceGroup: 'mock resource 3',
    year: 2018,
    month: 3,
    estimated: true,
    awsCosts: {
      amount: 9876543.5,
      currency: 'USD'
    }
  }
];

@Injectable()
export class CostsService {
  constructor(private connectorCostsService: ConnectorCostsService, private logger: LogService) {}

  public getCosts$(monthOfYear: MonthOfYear): Observable<Cost[]> {
    return this.connectorCostsService.getCosts(monthOfYear.month, monthOfYear.year).pipe(
      first(),
      map((awsCosts: AwsCosts) =>
        awsCosts.map((awsCostObject: AwsCostObject) => ({
          amount: awsCostObject.awsCosts.amount,
          group: awsCostObject.resourceGroup
        }))
      ),
      catchError(error => {
        this.logger.error(`[CostsService] could not retrieve costs for ${monthOfYear}:`, error.error);
        return of([]);
      })
    );
  }
}
