import { EventEmitter } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { instance, mock, verify, when } from 'ts-mockito/lib/ts-mockito';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  describe('currentLanguage$', () => {
    it('should emit current language when changed', () => {
      const translateServiceMock = mock(TranslateService);
      const onLangChangeEmitter = new EventEmitter<LangChangeEvent>();
      when(translateServiceMock.onLangChange).thenReturn(onLangChangeEmitter);

      let currentLanguage$Value: any = null;
      new LanguageService(instance(translateServiceMock)).currentLanguage$.pipe(first()).subscribe(lang => {
        currentLanguage$Value = lang;
      });

      onLangChangeEmitter.emit({ lang: 'de', translations: null });
      expect(currentLanguage$Value).toBe('de');
    });
  });

  describe('get currentLanguage', () => {
    it('should return the language code from TranslateService', () => {
      const translateServiceMock = mock(TranslateService);
      when(translateServiceMock.onLangChange).thenReturn(new EventEmitter());
      when(translateServiceMock.currentLang).thenReturn('de');

      expect(new LanguageService(instance(translateServiceMock)).currentLanguage).toBe('de');
    });

    it('should throw an Error if TranslateService returns unkown language code', () => {
      const translateServiceMock = mock(TranslateService);
      when(translateServiceMock.onLangChange).thenReturn(new EventEmitter());
      when(translateServiceMock.currentLang).thenReturn('unkown');

      expect(() => new LanguageService(instance(translateServiceMock)).currentLanguage).toThrowError(/Unknown/);
    });
  });

  describe('set currentLanguage', () => {
    it('should forward the given language to TranslateService', () => {
      const translateServiceMock = mock(TranslateService);
      when(translateServiceMock.onLangChange).thenReturn(new EventEmitter());

      new LanguageService(instance(translateServiceMock)).currentLanguage = 'de';
      verify(translateServiceMock.use('de')).once();
    });
  });
});
