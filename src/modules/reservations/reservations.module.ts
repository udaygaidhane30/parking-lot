import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reservation } from './reservation.model';
import { User } from '../users/user.model';
import { Spot } from '../spots/spot.model';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';

@Module({
  imports: [SequelizeModule.forFeature([Reservation, User, Spot])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}