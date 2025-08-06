import { Controller, Get, Post, Delete, Param, Body, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto): Promise<ReservationResponseDto> {
    return this.reservationsService.create(createReservationDto);
  }

  @Delete(':id')
  async cancel(@Param('id') id: string): Promise<void> {
    return this.reservationsService.cancel(id);
  }

  @Get('user/:userId/upcoming')
  async getUpcomingByUser(@Param('userId') userId: string): Promise<ReservationResponseDto[]> {
    return this.reservationsService.findUpcomingByUser(userId);
  }
}