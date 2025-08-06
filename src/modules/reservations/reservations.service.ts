import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Reservation } from './reservation.model';
import { User } from '../users/user.model';
import { Spot } from '../spots/spot.model';
import { ParkingLot } from '../parking-lots/parking-lot.model';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation)
    private reservationModel: typeof Reservation,
    @InjectModel(Spot)
    private spotModel: typeof Spot,
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<ReservationResponseDto> {
    const { userId, spotId, startTime, endTime } = createReservationDto;

    // Validate start and end times
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    if (start <= new Date()) {
      throw new BadRequestException('Start time must be in the future');
    }

    return await this.sequelize.transaction(async (transaction: Transaction) => {
      // Verify user exists
      const user = await this.userModel.findByPk(userId, { transaction });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Verify spot exists and is active
      const spot = await this.spotModel.findByPk(spotId, {
        include: [ParkingLot],
        transaction,
      });
      if (!spot) {
        throw new NotFoundException(`Spot with ID ${spotId} not found`);
      }
      if (!spot.isActive) {
        throw new BadRequestException('Spot is not active');
      }

      // Check for conflicting reservations using FOR UPDATE to prevent race conditions
      // Two time intervals overlap if: startA < endB AND endA > startB
      const conflictingReservations = await this.reservationModel.findAll({
        where: {
          spotId,
          status: ReservationStatus.ACTIVE,
          // Existing reservation overlaps with new reservation if:
          // existing.startTime < new.endTime AND existing.endTime > new.startTime
          startTime: {
            [Op.lt]: end, // existing starts before new ends
          },
          endTime: {
            [Op.gt]: start, // existing ends after new starts
          },
        },
        lock: Transaction.LOCK.UPDATE,
        transaction,
      });

      if (conflictingReservations.length > 0) {
        throw new ConflictException(
          `Spot is already reserved during the requested time period`
        );
      }

      // Create the reservation
      const reservation = await this.reservationModel.create({
        userId,
        spotId,
        startTime: start,
        endTime: end,
        status: ReservationStatus.ACTIVE,
      } as any, { transaction });

      // Fetch the created reservation with includes for response
      const createdReservation = await this.reservationModel.findByPk(reservation.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'email', 'firstName', 'lastName'],
          },
          {
            model: Spot,
            attributes: ['id', 'spotNumber', 'type'],
            include: [
              {
                model: ParkingLot,
                attributes: ['id', 'name', 'address'],
              },
            ],
          },
        ],
        transaction,
      });

      if (!createdReservation) {
        throw new Error('Failed to create reservation');
      }

      return {
        id: createdReservation.id,
        startTime: createdReservation.startTime,
        endTime: createdReservation.endTime,
        status: createdReservation.status,
        user: {
          id: createdReservation.user.id,
          email: createdReservation.user.email,
          firstName: createdReservation.user.firstName,
          lastName: createdReservation.user.lastName,
        },
        spot: {
          id: createdReservation.spot.id,
          spotNumber: createdReservation.spot.spotNumber,
          type: createdReservation.spot.type,
          parkingLot: {
            id: createdReservation.spot.parkingLot.id,
            name: createdReservation.spot.parkingLot.name,
            address: createdReservation.spot.parkingLot.address,
          },
        },
        createdAt: createdReservation.createdAt,
        updatedAt: createdReservation.updatedAt,
      };
    });
  }

  async cancel(id: string): Promise<void> {
    const reservation = await this.reservationModel.findByPk(id);
    
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    if (reservation.status !== ReservationStatus.ACTIVE) {
      throw new BadRequestException('Reservation is already cancelled or completed');
    }

    await reservation.update({ status: ReservationStatus.CANCELLED });
  }

  async findUpcomingByUser(userId: string): Promise<ReservationResponseDto[]> {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const reservations = await this.reservationModel.findAll({
      where: {
        userId,
        status: ReservationStatus.ACTIVE,
        startTime: {
          [Op.gt]: new Date(),
        },
      },
      include: [
        {
          model: User,
          attributes: ['id', 'email', 'firstName', 'lastName'],
        },
        {
          model: Spot,
          attributes: ['id', 'spotNumber', 'type'],
          include: [
            {
              model: ParkingLot,
              attributes: ['id', 'name', 'address'],
            },
          ],
        },
      ],
      order: [['startTime', 'ASC']],
    });

    return reservations.map(reservation => ({
      id: reservation.id,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      status: reservation.status,
      user: {
        id: reservation.user.id,
        email: reservation.user.email,
        firstName: reservation.user.firstName,
        lastName: reservation.user.lastName,
      },
      spot: {
        id: reservation.spot.id,
        spotNumber: reservation.spot.spotNumber,
        type: reservation.spot.type,
        parkingLot: {
          id: reservation.spot.parkingLot.id,
          name: reservation.spot.parkingLot.name,
          address: reservation.spot.parkingLot.address,
        },
      },
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    }));
  }
}