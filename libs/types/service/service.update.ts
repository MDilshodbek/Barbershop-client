import { ServiceStatus, ServiceType } from "../../enums/service.enum";

export interface ServiceUpdate {
  _id: string;
  serviceType?: ServiceType;
  serviceStatus?: ServiceStatus;
  serviceTitle?: string;
  serviceDuration?: number;
  servicePrice?: number;
  serviceDesc?: string;
  serviceImages?: string;
  updatedAt?: Date;
}
