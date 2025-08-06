import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Spot } from './spot.model';
import { SpotsService } from './spots.service';
import { SpotsController } from './spots.controller';

@Module({
  imports: [SequelizeModule.forFeature([Spot])],
  controllers: [SpotsController],
  providers: [SpotsService],
  exports: [SpotsService],
})
export class SpotsModule {}