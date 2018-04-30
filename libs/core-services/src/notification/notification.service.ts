import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { NotificationEvent } from './notification-event';
import { NotificationType } from './notification-type.enum';

const bufferSize = 10;

@Injectable()
export class NotificationService {
  private _notifications$$ = new BehaviorSubject<NotificationEvent[]>([]);
  private _counter$$ = new BehaviorSubject<number>(0);

  addNotification(title: string, description: string, type: NotificationType) {
    const notification: NotificationEvent = {
      title,
      description,
      type,
      timestamp: new Date()
    };
    this._counter$$.next(this._counter$$.value + 1);

    const currentNotifications = this._notifications$$.value;
    if (currentNotifications.length >= bufferSize) {
      currentNotifications.shift();
    }
    currentNotifications.push(notification);

    this._notifications$$.next(currentNotifications);
    this.showSystemNotification(notification);
  }

  get notifications$(): Observable<NotificationEvent[]> {
    return this._notifications$$.asObservable();
  }

  get notificationCount$(): Observable<number> {
    return this._counter$$.asObservable();
  }

  requestSystemNotificationPermission(): void {
    if ((<any>Notification).permission !== 'denied' && (<any>Notification).permission !== 'granted') {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          const success = new Notification('Welcome aboard!');
          setTimeout(() => {
            success.close();
          }, 5000);
        }
      });
    }
  }

  private showSystemNotification(notificationEvent: NotificationEvent) {
    if ((<any>Notification).permission === 'granted') {
      const notification = new Notification(notificationEvent.title, {
        body: notificationEvent.description
      });
      const timeoutId = setTimeout(() => {
        notification.close();
      }, 5000);
      notification.onclose = () => {
        clearTimeout(timeoutId);
      };
    }
  }
}
