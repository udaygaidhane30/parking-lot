import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class AvailabilityQueryDto extends PaginationDto {
  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsOptional()
  @IsUUID()
  lotId?: string;
}