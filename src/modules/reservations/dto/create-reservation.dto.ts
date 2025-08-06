import { IsDateString, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  spotId: string;

  @IsUUID()
  userId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}