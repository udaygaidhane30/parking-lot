import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { ReservationResponseDto } from '../reservations/dto/reservation-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    throw new Error('Method not implemented');
  }

  async getUpcomingReservations(id: string, paginationDto: PaginationDto): Promise<ReservationResponseDto[]> {
    throw new Error('Method not implemented');
  }
}