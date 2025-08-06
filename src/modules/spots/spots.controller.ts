import { Controller, Get, Query } from '@nestjs/common';
import { SpotsService } from './spots.service';
import { AvailabilityQueryDto } from '../../common/dto/availability-query.dto';
import { SpotResponseDto } from './dto/spot-response.dto';

@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Get('availability')
  async checkAvailability(@Query() query: AvailabilityQueryDto): Promise<SpotResponseDto[]> {
    return this.spotsService.checkAvailability(query);
  }
}