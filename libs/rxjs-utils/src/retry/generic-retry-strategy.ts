import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { timer } from 'rxjs/observable/timer';
import { finalize, mergeMap } from 'rxjs/operators';

/**
 * This is a generic retry strategy which can be used in combination with the retryWhen operator.
 * Use it like this:
 *
 *  this._appService
 *     .getData(500)
 *     .pipe(
 *       retryWhen(genericRetryStrategy({
 *         maxRetryAttempts: 10, // defaults to 3
 *         scalingDuration: 2000, // back-off time, will be multiplied by current retry attempt
 *         excludedStatusCodes: [500], // if you don't want to retry on certain status codes
 *         logger: (message) => this.logger.log(message) // pass a function which accepts a string if you want to log some internal messages
 *       })),
 *       catchError(error => of(error))
 *     )
 *     .subscribe(e => console.log('Exluded code:', e.status));
 *
 *
 *
 * https://github.com/btroncone/learn-rxjs/blob/master/operators/error_handling/retrywhen.md
 */
export type GenericRetryStrategy = (
  options: {
    maxRetryAttempts?: number;
    scalingDuration?: number;
    excludedStatusCodes?: number[];
    logger?: (message: string) => void;
  }
) => (attempts: Observable<any>) => Observable<any>;

/**
 * This is a generic retry strategy which can be used in combination with the retryWhen operator.
 * Use it like this:
 *
 *  this._appService
 *     .getData(500)
 *     .pipe(
 *       retryWhen(genericRetryStrategy({
 *         maxRetryAttempts: 10, // defaults to 3
 *         scalingDuration: 2000, // back-off time, will be multiplied by current retry attempt
 *         excludedStatusCodes: [500], // if you don't want to retry on certain status codes
 *         logger: (message) => this.logger.log(message) // pass a function which accepts a string if you want to log some internal messages
 *       })),
 *       catchError(error => of(error))
 *     )
 *     .subscribe(e => console.log('Exluded code:', e.status));
 *
 *
 *
 * https://github.com/btroncone/learn-rxjs/blob/master/operators/error_handling/retrywhen.md
 */
export const genericRetryStrategy: GenericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = [],
  logger = message => void 0
}: {
  maxRetryAttempts?: number;
  scalingDuration?: number;
  excludedStatusCodes?: number[];

  logger?: (message: string) => void;
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
        return _throw(error);
      }
      logger(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => logger('We are done!'))
  );
};
