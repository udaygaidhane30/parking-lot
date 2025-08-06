import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { ParkingLotsService } from '../src/modules/parking-lots/parking-lots.service';
import { ParkingLot } from '../src/modules/parking-lots/parking-lot.model';
import { Spot } from '../src/modules/spots/spot.model';

describe('ParkingLotsService', () => {
  let service: ParkingLotsService;
  let mockParkingLotModel: any;

  const mockParkingLot = {
    id: 'lot-123',
    name: 'Downtown Parking',
    address: '123 Main St',
    openTime: '06:00:00',
    closeTime: '22:00:00',
    spots: [
      { id: 'spot-1', type: 'regular', isActive: true },
      { id: 'spot-2', type: 'compact', isActive: true },
      { id: 'spot-3', type: 'ev', isActive: false },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockParkingLotModel = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingLotsService,
        {
          provide: getModelToken(ParkingLot),
          useValue: mockParkingLotModel,
        },
      ],
    }).compile();

    service = module.get<ParkingLotsService>(ParkingLotsService);
  });

  describe('findAll', () => {
    it('should return an array of parking lots with available spots count', async () => {
      mockParkingLotModel.findAll.mockResolvedValue([mockParkingLot]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual([
        {
          id: 'lot-123',
          name: 'Downtown Parking',
          address: '123 Main St',
          openTime: '06:00:00',
          closeTime: '22:00:00',
          totalSpots: 3,
          availableSpots: 2, // Only active spots count
          createdAt: mockParkingLot.createdAt,
          updatedAt: mockParkingLot.updatedAt,
        },
      ]);

      expect(mockParkingLotModel.findAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        include: [
          {
            model: Spot,
            attributes: ['id', 'type', 'isActive'],
          },
        ],
        order: [['name', 'ASC']],
      });
    });
  });

  describe('findOne', () => {
    it('should return a parking lot by id', async () => {
      mockParkingLotModel.findByPk.mockResolvedValue(mockParkingLot);

      const result = await service.findOne('lot-123');

      expect(result).toEqual({
        id: 'lot-123',
        name: 'Downtown Parking',
        address: '123 Main St',
        openTime: '06:00:00',
        closeTime: '22:00:00',
        totalSpots: 3,
        availableSpots: 2,
        createdAt: mockParkingLot.createdAt,
        updatedAt: mockParkingLot.updatedAt,
      });
    });

    it('should throw NotFoundException when parking lot not found', async () => {
      mockParkingLotModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});