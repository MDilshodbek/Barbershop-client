import { Direction } from "../../enums/common.enum";


export interface ReserveInput {
  barberId?: string;
  serviceId: string;
  reserveRefId?: string;
  reserveTime: Date;
  reserveDay: Date;
  reserveNotes?: string;
}

export interface ReserveInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
}

export interface BarberScheduleInquiry {
  text?: string;
  ymd?: string;
  reserveDay?: Date;
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
}

export interface CancelReservationInput {
  reservationId: string;
  reason?: string;
}

