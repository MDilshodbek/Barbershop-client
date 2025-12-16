import { NotificationType } from "../../enums/notification.enum";

export interface NotificationInput {
  notificationType: NotificationType;
  notificationMessage: string;
  entityId: string;
  receiverId: string;
  authorId?: string;
}

export interface NotificationInquiry {
  page: number;
  limit: number;
}
