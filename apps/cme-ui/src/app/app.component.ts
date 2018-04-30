import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PresentationMode, PresentationModeProvider } from '@cme2/shared';

import { AppRoutingService } from './app-routing.service';
import { presentationAnimation } from './presentation-animation';

@Component({
  selector: 'cme-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [presentationAnimation]
})
export class AppComponent implements OnInit {
  public constructor(
    private presentationModeProvider: PresentationModeProvider,
    private appRouting: AppRoutingService
  ) {}

  public getPresentationAnimationState(outlet: RouterOutlet): string | undefined {
    if (this.presentationModeProvider.presentationMode === PresentationMode.Off) {
      return undefined;
    } else {
      return outlet.activatedRouteData.pageName;
    }
  }

  ngOnInit(): void {
    this.appRouting.start();
  }
}
