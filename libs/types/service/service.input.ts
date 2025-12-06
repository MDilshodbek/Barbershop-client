import { ServiceStatus, ServiceType } from "../../enums/service.enum";

export interface ServiceInput {
  serviceType: ServiceType;
  serviceTitle: string;
  serviceDuration: number;
  servicePrice: number;
  serviceDesc?: string;
  serviceImages: string[];
}

export interface ServiceInquiry {
  page: number;
  limit: number;
  text?: string;
  serviceStatus?: ServiceStatus;
}
