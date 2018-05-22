import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LogService } from '@cme2/logging';
import { PresentationMode } from '@cme2/shared';
import { Subscription } from 'rxjs/Subscription';

import { AuthService, PresentationService } from './shared';

@Injectable()
export class AppRoutingService implements OnDestroy {
  private subscription = Subscription.EMPTY;

  constructor(
    private authService: AuthService,
    private router: Router,
    private presentationService: PresentationService,
    private logger: LogService
  ) {}

  public start() {
    this.subscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.navigateToHomeView();
      } else {
        this.stopPresentationMode();
        this.navigateToNotLoggedInView();
      }
    });
  }

  navigateToHomeView(): void {
    this.logger.info(`User authenticated, navigating to home view`);
    this.router.navigate(['/domain-model']);
  }

  stopPresentationMode(): void {
    this.presentationService.presentationMode = PresentationMode.Off;
  }

  navigateToNotLoggedInView(): void {
    this.logger.info(`User is not authenticated, navigating to not-logged-in view`);
    this.router.navigate(['/not-logged-in']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription = Subscription.EMPTY;
  }
}
