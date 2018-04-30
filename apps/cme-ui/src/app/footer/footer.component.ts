import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClusterConnection, ClusterManagerService } from '@cme2/core-services';
import { LanguageCode, LanguageService } from '@cme2/i18n';
import { LogService } from '@cme2/logging';
import { PresentationMode } from '@cme2/shared';

import { PresentationService } from '../shared';

interface Lang {
  langCode: LanguageCode;
  translationLabel: string;
}

@Component({
  selector: 'cme-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public slideShowButtonIcon: 'stop_screen_share' | 'screen_share' = 'stop_screen_share';
  public slideShowOn = false;
  public readonly languages: ReadonlyArray<Lang>;

  public constructor(
    private readonly presentationService: PresentationService,
    public readonly clusterManager: ClusterManagerService,
    private languageService: LanguageService,
    private logger: LogService,
    private router: Router
  ) {
    const langCodeToTranslationLabel = (langCode: LanguageCode) =>
      langCode === 'en' ? 'global.english' : 'global.german';
    this.languages = this.languageService.availableLanguages.map(lang => ({
      langCode: lang,
      translationLabel: langCodeToTranslationLabel(lang)
    }));
  }

  public toggleSlideShow() {
    this.slideShowOn = !this.slideShowOn;
    this.updateSlideShowButton(this.slideShowOn); // immediately change button label
  }

  public updateSlideShowButton(slideShowOn: boolean): void {
    this.slideShowButtonIcon = slideShowOn ? 'screen_share' : 'stop_screen_share';
    this.presentationService.presentationMode = slideShowOn ? PresentationMode.On : PresentationMode.Off;
  }

  public selectLangauge(langCode: LanguageCode) {
    this.logger.info(`Setting language to ${langCode}`);
    this.languageService.currentLanguage = langCode;
  }

  public selectConnection(connection: ClusterConnection) {
    this.clusterManager.setCurrentConnection(connection);
  }
}
