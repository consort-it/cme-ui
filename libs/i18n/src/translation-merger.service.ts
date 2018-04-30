import { Injectable } from '@angular/core';
import { LogService } from '@cme2/logging';
import { TranslateService } from '@ngx-translate/core';

/**
 * Provides functionality to merge translations into the globally loaded translations.
 * This is useful for lazy loaded modules that bring their own translation.
 */
@Injectable()
export class TranslationMergerService {
  public constructor(private readonly translateService: TranslateService, private logger: LogService) {
    translateService.onTranslationChange.subscribe((translations: Object) =>
      logger.info('Merged new translations', translations)
    );
  }

  addTranslations(language: string, translations: Object): void {
    this.logger.info(`adding translations for language '${language}':`, translations);
    this.translateService.setTranslation(language, translations, true);
  }
}
