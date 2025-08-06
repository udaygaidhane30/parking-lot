import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { ParkingLotsModule } from './modules/parking-lots/parking-lots.module';
import { SpotsModule } from './modules/spots/spots.module';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    ParkingLotsModule,
    SpotsModule,
    ReservationsModule,
  ],
})
export class AppModule {}