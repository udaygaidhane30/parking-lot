import { Controller, Get, Param, Query } from '@nestjs/common';
import { ParkingLotsService } from './parking-lots.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ParkingLotResponseDto } from './dto/parking-lot-response.dto';

@Controller('parking-lots')
export class ParkingLotsController {
  constructor(private readonly parkingLotsService: ParkingLotsService) {}

  @Get()
  async findAll(@Query() paginationDto: PaginationDto): Promise<ParkingLotResponseDto[]> {
    return this.parkingLotsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ParkingLotResponseDto> {
    return this.parkingLotsService.findOne(id);
  }

  @Get(':id/spots')
  async getSpots(@Param('id') id: string, @Query() paginationDto: PaginationDto) {
    return this.parkingLotsService.getSpots(id, paginationDto);
  }
}