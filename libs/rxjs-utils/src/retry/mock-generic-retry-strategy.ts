import { GenericRetryStrategy } from '@cme2/rxjs-utils';
import { _throw } from 'rxjs/observable/throw';

export const mockGenericRetryStrategy: GenericRetryStrategy = () => error => _throw(error);
