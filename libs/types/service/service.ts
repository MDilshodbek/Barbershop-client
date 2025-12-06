import { TotalCounter } from '../member/member';
import { ServiceStatus, ServiceType } from '../../enums/service.enum';

export interface Service {
  _id: string;
  serviceType: ServiceType;
  serviceStatus: ServiceStatus;
  serviceTitle: string;
  serviceDuration: number;
  servicePrice: number;
  serviceImages: string[];
  serviceDesc?: string;
  serviceReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Services {
  list: Service[];
  metaCounter?: TotalCounter[];
}

