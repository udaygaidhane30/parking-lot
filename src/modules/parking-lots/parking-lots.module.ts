import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ParkingLot } from './parking-lot.model';
import { ParkingLotsService } from './parking-lots.service';
import { ParkingLotsController } from './parking-lots.controller';

@Module({
  imports: [SequelizeModule.forFeature([ParkingLot])],
  controllers: [ParkingLotsController],
  providers: [ParkingLotsService],
  exports: [ParkingLotsService],
})
export class ParkingLotsModule {}