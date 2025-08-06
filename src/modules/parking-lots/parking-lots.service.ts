import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ParkingLot } from './parking-lot.model';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ParkingLotResponseDto } from './dto/parking-lot-response.dto';

@Injectable()
export class ParkingLotsService {
  constructor(
    @InjectModel(ParkingLot)
    private parkingLotModel: typeof ParkingLot,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<ParkingLotResponseDto[]> {
    throw new Error('Method not implemented');
  }

  async findOne(id: string): Promise<ParkingLotResponseDto> {
    throw new Error('Method not implemented');
  }

  async getSpots(id: string, paginationDto: PaginationDto) {
    throw new Error('Method not implemented');
  }
}