import { NotificationType } from './notification-type.enum';

export interface NotificationEvent {
  title: string;
  description: string;
  type: NotificationType;
  timestamp: Date;
}
