import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Spot } from './spot.model';
import { AvailabilityQueryDto } from '../../common/dto/availability-query.dto';
import { SpotResponseDto } from './dto/spot-response.dto';

@Injectable()
export class SpotsService {
  constructor(
    @InjectModel(Spot)
    private spotModel: typeof Spot,
  ) {}

  async checkAvailability(query: AvailabilityQueryDto): Promise<SpotResponseDto[]> {
    throw new Error('Method not implemented');
  }
}