import { Overlay, OverlayConfig, PositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationService, NotificationType } from '@cme2/core-services';
import { LogService } from '@cme2/logging';
import { Observable } from 'rxjs/Observable';

import { NotificationPanelComponent } from '../notifications/notification-panel/notification-panel.component';
import { AuthService } from '../shared';
import { of } from 'rxjs/observable/of';
import { Subject } from 'rxjs/Subject';
import { exhaustMap, mapTo, first, map, take, tap } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

const NOTIFICATION_DELAY_BETWEEN_SHAKES = 4000;

@Component({
  selector: 'cme-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  public readonly user$: Observable<string> | null | undefined;
  public readonly isAuthenticated$: Observable<boolean>;

  private _shakeIt$$ = new Subject<void>();
  public shakeIt$ = this._shakeIt$$.pipe(
    exhaustMap(() => timer(0, NOTIFICATION_DELAY_BETWEEN_SHAKES).pipe(map(num => (num === 0 ? true : false)), take(2)))
  );

  private _notificationCount = 0;

  constructor(
    private logService: LogService,
    private auth: AuthService,
    public notificationService: NotificationService,
    private overlay: Overlay
  ) {
    this.user$ = auth.fullName$;
    this.isAuthenticated$ = auth.isAuthenticated$;
  }

  @ViewChild('notificationButton', { read: ElementRef })
  notificationButtonRef: ElementRef | undefined;

  ngOnInit() {
    this.notificationService.notificationCount$.subscribe(x => {
      this.logService.debug(`Notification count is `, x);
      this._notificationCount = x;
      this._shakeIt$$.next();
    });
  }

  onNotificationClick() {
    this.notificationService.requestSystemNotificationPermission();
    if (this._notificationCount > 0) {
      if (this.notificationButtonRef) {
        const overlayPosition: PositionStrategy = this.getPositionStrategy(this.notificationButtonRef);

        const overlayConfig: OverlayConfig = {
          hasBackdrop: true,
          backdropClass: 'cdk-overlay-transparent-backdrop',
          positionStrategy: overlayPosition
        };

        const overlayRef = this.overlay.create(overlayConfig);
        this.logService.info(`Opening overlay with config:`, overlayConfig);
        const notificationPanelPortal = new ComponentPortal(NotificationPanelComponent);
        overlayRef.attach(notificationPanelPortal);
        overlayRef.backdropClick().subscribe(mouseEvent => {
          overlayRef.detach();
          overlayRef.dispose();
        });
      }
    }
  }

  onHornetClick() {
    this.notificationService.addNotification(`Hornet's angry`, `Don't mess with the hornet!`, NotificationType.Warning);
  }

  logout() {
    this.auth.logout();
  }

  private getPositionStrategy(elementRef: ElementRef): PositionStrategy {
    return this.overlay
      .position()
      .connectedTo(elementRef, { originX: 'center', originY: 'center' }, { overlayX: 'end', overlayY: 'top' });
  }
}
