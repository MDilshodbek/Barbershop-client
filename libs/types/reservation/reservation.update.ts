import { ReserveStatus } from "../../enums/reservation.enum";

export interface ReserveUpdate {
	reservationId: string;
	reserveStatus: ReserveStatus;
}
