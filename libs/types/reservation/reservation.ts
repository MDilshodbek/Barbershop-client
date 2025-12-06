import { ReserveStatus } from "../../enums/reservation.enum";
import { Member, TotalCounter } from "../member/member";
import { Service } from "../service/service";

export interface Reservation {
  _id: string;
  reserveStatus: ReserveStatus;
  barberId: string;
  serviceId: string;
  serviceTitle: string;
  servicePrice: number;
  serviceDurationMin: number;
  reserveRefId: string;
  reserveTime: Date;
  reserveEndTime: Date;
  reserveDay: Date;
  reserveNotes?: string;
  cancelReason?: string;
  cancelledAt?: Date;
  cancelledById?: string;
  createdAt: Date;
  updatedAt: Date;

  barberData?: Member;
  serviceData?: Service;
  clientData?: Member;
}

export interface Reservations {
  list: Reservation[];
  metaCounter?: TotalCounter[];
}

