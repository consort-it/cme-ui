import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgModule, NgModuleFactoryLoader } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { I18nModule } from '@cme2/i18n';
import { LoggingModule } from '@cme2/logging';
import { TranslateService } from '@ngx-translate/core';

const anyRequest = () => true;

describe('I18nModule', () => {
  describe('forRoot()', () => {
    it('should set "de" as language', () => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, I18nModule.forRoot(), LoggingModule.forMocking()]
      });

      const translateService = TestBed.get(TranslateService) as TranslateService;
      expect(translateService.currentLang).toBe('de');
    });

    it('should load the global translations', () => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, I18nModule.forRoot(), LoggingModule.forMocking()]
      });
      const httpMock = TestBed.get(HttpTestingController) as HttpTestingController;
      const requestedUrls = httpMock.match(anyRequest).map(req => req.request.url);

      expect(requestedUrls).toContain('assets/i18n/en.json');
      expect(requestedUrls).toContain('assets/i18n/de.json');
    });
  });

  describe('forChild()', () => {
    it(
      'should merge given translations with the global ones',
      fakeAsync(() => {
        TestBed.configureTestingModule({
          imports: [RouterTestingModule, HttpClientTestingModule, I18nModule.forRoot(), LoggingModule.forMocking()]
        });

        // provide global translations
        const httpMock = TestBed.get(HttpTestingController) as HttpTestingController;
        httpMock.expectOne('assets/i18n/en.json').flush({ 'root en': 'en' });
        httpMock.expectOne('assets/i18n/de.json').flush({ 'root de': 'de' });

        // load a lazy module that provides child translations
        @NgModule({ imports: [I18nModule.forChild({ en: { 'child en': 'en' }, de: { 'child de': 'de' } })] })
        class LazyChildModule {}

        const loader = TestBed.get(NgModuleFactoryLoader);
        loader.stubbedModules = { lazyModule: LazyChildModule };

        const router = TestBed.get(Router) as Router;
        router.resetConfig([{ path: 'lazy', loadChildren: 'lazyModule' }]);
        router.navigateByUrl('/lazy');

        // tick for translate module to have time to merge the translations
        tick();
        const translateService = TestBed.get(TranslateService) as TranslateService;
        expect(translateService.translations).toEqual({
          en: { 'root en': 'en', 'child en': 'en' },
          de: { 'root de': 'de', 'child de': 'de' }
        });
      })
    );
  });
});
