import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { publishReplay, map, switchMap } from 'rxjs/operators';

export type LanguageCode = 'en' | 'de';

@Injectable()
export class LanguageService {
  public readonly currentLanguage$: Observable<LanguageCode>;
  public readonly availableLanguages: ReadonlyArray<LanguageCode> = ['en', 'de'];

  public constructor(private readonly translateService: TranslateService) {
    this.currentLanguage$ = translateService.onLangChange.pipe(
      map(langChangeEvent => {
        return this.stringToLanguageCode(langChangeEvent.lang);
      })
    );
  }

  public get currentLanguage(): LanguageCode {
    return this.stringToLanguageCode(this.translateService.currentLang);
  }

  private stringToLanguageCode(languageCodeString: string): LanguageCode {
    if (this.isKnownLanguage(languageCodeString)) {
      return languageCodeString;
    } else {
      throw new Error(`Unknown language '${languageCodeString}'`);
    }
  }

  private isKnownLanguage(lang: string): lang is LanguageCode {
    return this.availableLanguages.find(langCode => langCode === lang) !== undefined;
  }

  public set currentLanguage(language: LanguageCode) {
    this.translateService.use(language);
  }
}
