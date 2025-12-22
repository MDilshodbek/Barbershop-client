import { TotalCounter } from '../member/member';
import { ServiceStatus, ServiceType } from '../../enums/service.enum';

export interface Service {
  _id: string;
  serviceStatus: ServiceStatus;
  serviceTitle: string;
  servicePrice: number;
  serviceType: ServiceType;
  serviceDuration: number;
  serviceDesc?: string;
  serviceImages: string[];
  serviceReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Services {
  list: Service[];
  metaCounter?: TotalCounter[];
}

