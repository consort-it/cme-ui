import { NotificationEntryComponent } from './notification-entry.component';
import { NotificationEvent, NotificationType } from '@cme2/core-services';

describe('NotificationEntryComponent', () => {
  [
    {
      type: NotificationType.Alert,
      expected: 'error'
    },
    {
      type: NotificationType.Warning,
      expected: 'warning'
    },
    {
      type: NotificationType.Info,
      expected: 'info'
    }
  ].forEach(testCase => {
    it(`should set icon type to ${testCase.expected} when notification type is ${testCase.type}`, () => {
      const sut = new NotificationEntryComponent();
      const notificationEvent: NotificationEvent = {
        title: 'test',
        description: 'this ist a test',
        type: testCase.type,
        timestamp: new Date()
      };
      sut.notification = notificationEvent;

      expect(sut.iconType).toEqual(testCase.expected);
    });
  });
});
