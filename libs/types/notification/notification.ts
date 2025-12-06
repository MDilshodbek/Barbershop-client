import { NotificationStatus, NotificationType } from "../../enums/notification.enum";
import { Member, TotalCounter } from "../member/member";


export interface Notification {
  _id: string; 
  notificationStatus: NotificationStatus;
  notificationType: NotificationType;
  notificationMessage: string;
  authorId: string;   
  receiverId: string; 
  entityId: string;   
  readAt?: Date | null; 
  createdAt: Date;
  updatedAt: Date;
  // From aggregation
  memberData?: Member; 
  entityData?: any;    
}

export interface Notifications {
	list: Notification[];
	metaCounter: TotalCounter[];
}
