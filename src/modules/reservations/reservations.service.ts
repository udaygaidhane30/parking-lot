import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Reservation } from './reservation.model';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation)
    private reservationModel: typeof Reservation,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<ReservationResponseDto> {
    throw new Error('Method not implemented');
  }

  async cancel(id: string): Promise<void> {
    throw new Error('Method not implemented');
  }
}