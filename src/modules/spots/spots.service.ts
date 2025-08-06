import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Spot } from './spot.model';
import { Reservation } from '../reservations/reservation.model';
import { ParkingLot } from '../parking-lots/parking-lot.model';
import { AvailabilityQueryDto } from '../../common/dto/availability-query.dto';
import { SpotResponseDto } from './dto/spot-response.dto';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';

@Injectable()
export class SpotsService {
  constructor(
    @InjectModel(Spot)
    private spotModel: typeof Spot,
  ) {}

  async checkAvailability(query: AvailabilityQueryDto): Promise<SpotResponseDto[]> {
    const { startTime, endTime, lotId, page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const whereClause: any = {
      isActive: true,
      id: {
        [Op.notIn]: this.spotModel.sequelize!.literal(`(
          SELECT DISTINCT spot_id FROM reservations 
          WHERE status = 'active'
          AND start_time < :endTime
          AND end_time > :startTime
        )`),
      },
    };

    if (lotId) {
      whereClause.parkingLotId = lotId;
    }

    const spots = await this.spotModel.findAll({
      where: whereClause,
      include: [
        {
          model: ParkingLot,
          attributes: ['id', 'name', 'address'],
        },
      ],
      limit,
      offset,
      order: [['spotNumber', 'ASC']],
      replacements: {
        endTime: new Date(endTime),
        startTime: new Date(startTime),
      },
    });

    return spots.map(spot => ({
      id: spot.id,
      spotNumber: spot.spotNumber,
      type: spot.type,
      isActive: spot.isActive,
      parkingLotId: spot.parkingLotId,
      parkingLot: spot.parkingLot ? {
        id: spot.parkingLot.id,
        name: spot.parkingLot.name,
        address: spot.parkingLot.address,
      } : undefined,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
    }));
  }

  async findById(id: string): Promise<SpotResponseDto | null> {
    const spot = await this.spotModel.findByPk(id, {
      include: [
        {
          model: ParkingLot,
          attributes: ['id', 'name', 'address'],
        },
      ],
    });

    if (!spot) {
      return null;
    }

    return {
      id: spot.id,
      spotNumber: spot.spotNumber,
      type: spot.type,
      isActive: spot.isActive,
      parkingLotId: spot.parkingLotId,
      parkingLot: spot.parkingLot ? {
        id: spot.parkingLot.id,
        name: spot.parkingLot.name,
        address: spot.parkingLot.address,
      } : undefined,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
    };
  }
}