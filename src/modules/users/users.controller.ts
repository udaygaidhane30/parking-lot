import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ReservationResponseDto } from '../reservations/dto/reservation-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get(':id/reservations')
  async getReservations(
    @Param('id') id: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<ReservationResponseDto[]> {
    return this.usersService.getUpcomingReservations(id, paginationDto);
  }
}