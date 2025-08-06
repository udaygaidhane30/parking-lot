import { ReservationStatus } from '../../../common/enums/reservation-status.enum';

export class ReservationResponseDto {
  id: string;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  userId: string;
  spotId: string;
  spot?: {
    id: string;
    spotNumber: string;
    type: string;
    parkingLot?: {
      id: string;
      name: string;
      address: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}