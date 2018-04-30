import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { LogService } from '@cme2/logging';

export class LogMissingTranslationHandler implements MissingTranslationHandler {
  public constructor(private logService: LogService) {}

  handle(params: MissingTranslationHandlerParams) {
    this.logService.error(
      '[LogMissingTranslationHandler]',
      new Error( // use Error to have the stack trace logged
        `Missing translation. Key: '${params.key}', interpolateParams: ${JSON.stringify(params.interpolateParams)}`
      )
    );
  }
}
