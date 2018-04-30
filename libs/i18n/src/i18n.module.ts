import { HttpClient } from '@angular/common/http';
import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { LogService } from '@cme2/logging';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LanguageService } from './language.service';
import { LogMissingTranslationHandler } from './log-missing-translation-handler';
import { TranslationMergerService } from './translation-merger.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

/**
 * Root I18nModule. Don't import this directly! Use I18nModule.forRoot() instead!
 */
@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: LogMissingTranslationHandler,
        deps: [LogService]
      }
    })
  ],
  exports: [TranslateModule]
})
export class I18nModuleForRoot {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: I18nModuleForRoot,
    translate: TranslateService,
    logger: LogService
  ) {
    if (parentModule) {
      throw new Error('I18nModuleForRoot is already loaded. Import it in the AppModule only');
    }
    translate.addLangs(['en', 'de']);
    translate.setDefaultLang('en');
    translate.use('de'); // FIXME: I don't know why, but when I choose 'en' here, then the global translations from de.json will not be merged correctly when solution view translations are added...
    /*translate
      .getTranslation('en')
      .subscribe(translations => logger.debug('[I18nModuleForRoot] loaded en translations', translations));
    translate
      .getTranslation('de')
      .subscribe(translations => logger.debug('[I18nModuleForRoot] loaded de translations', translations));*/
  }
}

export const childTranslationsToken = new InjectionToken('[child translations]');

/**
 * I18nModule for lazy loaded childs. Don't import this directly! Use I18nModule.forChild() instead!
 */
@NgModule({
  imports: [
    TranslateModule.forChild({
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: LogMissingTranslationHandler,
        deps: [LogService]
      }
    })
  ],
  exports: [TranslateModule]
})
export class I18nModuleForChild {
  constructor(
    private translationMerger: TranslationMergerService,
    @Optional()
    @Inject(childTranslationsToken)
    translations: any
  ) {
    if (translations) {
      Object.getOwnPropertyNames(translations).forEach(language =>
        this.translationMerger.addTranslations(language, translations[language])
      );
    }
  }
}

/**
 * Module for internationalization.
 *
 * Root app module must import ``I18nModule.forRoot()``,
 * Lazy loaded modules must import ``I18nModule.forChild(...)``,
 * feature modules can directly import ``I18nModule`` (they have to import it to be able to use the ```translate`` pipe).
 */
@NgModule({
  imports: [TranslateModule],
  exports: [TranslateModule]
})
export class I18nModule {
  /**
   * Gets the root I18nModule. Json files with translations must be available via http under ``assets/i18n/``.
   */
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: I18nModuleForRoot,
      providers: [TranslationMergerService, LanguageService]
    };
  }

  /**
   * Gets the I18nModule for childs (i.e. lazy loaded view modules)
   * @param translations translations for the child module, see https://github.com/ngx-translate/core#3-define-the-translations.
   *                     The given translations will be merged with the global translation, so the child is responsible for choosing a unique namespace.
   */
  static forChild(translations: { en?: Object; de?: Object } = {}): ModuleWithProviders {
    return {
      ngModule: I18nModuleForChild,
      providers: [{ provide: childTranslationsToken, useValue: translations }]
    };
  }
}
