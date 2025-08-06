import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ParkingLot } from './parking-lot.model';
import { Spot } from '../spots/spot.model';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ParkingLotResponseDto } from './dto/parking-lot-response.dto';

@Injectable()
export class ParkingLotsService {
  constructor(
    @InjectModel(ParkingLot)
    private parkingLotModel: typeof ParkingLot,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<ParkingLotResponseDto[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    const parkingLots = await this.parkingLotModel.findAll({
      limit,
      offset,
      include: [
        {
          model: Spot,
          attributes: ['id', 'type', 'isActive'],
        },
      ],
      order: [['name', 'ASC']],
    });

    return parkingLots.map(lot => ({
      id: lot.id,
      name: lot.name,
      address: lot.address,
      openTime: lot.openTime,
      closeTime: lot.closeTime,
      totalSpots: lot.spots?.length || 0,
      availableSpots: lot.spots?.filter(spot => spot.isActive).length || 0,
      createdAt: lot.createdAt,
      updatedAt: lot.updatedAt,
    }));
  }

  async findOne(id: string): Promise<ParkingLotResponseDto> {
    const parkingLot = await this.parkingLotModel.findByPk(id, {
      include: [
        {
          model: Spot,
          attributes: ['id', 'type', 'isActive'],
        },
      ],
    });

    if (!parkingLot) {
      throw new NotFoundException(`Parking lot with ID ${id} not found`);
    }

    return {
      id: parkingLot.id,
      name: parkingLot.name,
      address: parkingLot.address,
      openTime: parkingLot.openTime,
      closeTime: parkingLot.closeTime,
      totalSpots: parkingLot.spots?.length || 0,
      availableSpots: parkingLot.spots?.filter(spot => spot.isActive).length || 0,
      createdAt: parkingLot.createdAt,
      updatedAt: parkingLot.updatedAt,
    };
  }

  async getSpots(id: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const offset = (page - 1) * limit;

    const parkingLot = await this.parkingLotModel.findByPk(id);
    if (!parkingLot) {
      throw new NotFoundException(`Parking lot with ID ${id} not found`);
    }

    const spots = await Spot.findAll({
      where: { parkingLotId: id },
      limit,
      offset,
      order: [['spotNumber', 'ASC']],
    });

    return spots.map(spot => ({
      id: spot.id,
      spotNumber: spot.spotNumber,
      type: spot.type,
      isActive: spot.isActive,
      parkingLotId: spot.parkingLotId,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
    }));
  }
}