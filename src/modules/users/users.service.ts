import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from './user.model';
import { Reservation } from '../reservations/reservation.model';
import { Spot } from '../spots/spot.model';
import { ParkingLot } from '../parking-lots/parking-lot.model';
import { CreateUserDto } from './dto/create-user.dto';
import { ReservationResponseDto } from '../reservations/dto/reservation-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Reservation)
    private reservationModel: typeof Reservation,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, firstName, lastName, phone } = createUserDto;

    // Check if user with this email already exists
    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userModel.create({
      email,
      firstName,
      lastName,
      phone: phone || null,
    } as any);

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
  }

  async findById(id: string) {
    const user = await this.userModel.findByPk(id);
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
  }

  async getUpcomingReservations(id: string, paginationDto: PaginationDto): Promise<ReservationResponseDto[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    // Verify user exists
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const reservations = await this.reservationModel.findAll({
      where: {
        userId: id,
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
      limit,
      offset,
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