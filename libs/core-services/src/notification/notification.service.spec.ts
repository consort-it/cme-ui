import { TestBed, inject } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { NotificationType } from '@cme2/core-services';
import { NotificationEvent } from '@cme2/core-services/src/notification';

describe('NotificationService', () => {
  it('should emit a NotificationEvent when a notification is added', (done: Function) => {
    const sut = new NotificationService();

    const title = 'TestNotification';
    const description = 'TestMessage';
    const type = NotificationType.Alert;

    const expected: NotificationEvent = {
      description,
      title,
      type,
      timestamp: <any>jasmine.any(Date)
    };

    sut.addNotification(title, description, type);

    sut.notifications$.subscribe(notification => {
      expect(notification).toEqual([expected]);
      done();
    });
  });

  it('should emit a new count value when a notification is added', (done: Function) => {
    const sut = new NotificationService();

    const title = 'TestNotification';
    const description = 'TestMessage';
    const type = NotificationType.Alert;

    const expected = 1;

    sut.addNotification(title, description, type);

    sut.notificationCount$.subscribe(counterValue => {
      expect(counterValue).toEqual(expected);
      done();
    });
  });

  [
    {
      input: 9,
      expected: 9
    },
    {
      input: 10,
      expected: 10
    },
    {
      input: 11,
      expected: 10 // Service hold only the last 10 Notifications, oldest will be deleted
    }
  ].forEach(testCase => {
    it(`should emit ${testCase.expected} NotificationEvents when ${
      testCase.input
    } notifications are added`, (done: Function) => {
      const sut = new NotificationService();

      const title = 'TestNotification';
      const description = 'TestMessage';
      const type = NotificationType.Alert;

      for (let i = 0; i < testCase.input; i++) {
        sut.addNotification(title, description, type);
      }

      sut.notifications$.subscribe(notification => {
        expect(notification.length).toEqual(testCase.expected);
        done();
      });
    });
  });
});
