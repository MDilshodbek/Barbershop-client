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
  sort?: string;
  direction?: Direction;
}

export interface SelectedBarberScheduleInquiry {
  ymd?: string;
  reserveDay?: Date;
  sort?: string;
  direction?: Direction;
  barberId: string;
}

export interface CancelReservationInput {
  reservationId: string;
  cancelReason?: string;
}

export interface AllBarberScheduleInquiry {
  sort?: string;
  direction?: Direction;
}
