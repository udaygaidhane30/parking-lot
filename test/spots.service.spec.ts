import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { SpotsService } from '../src/modules/spots/spots.service';
import { Spot } from '../src/modules/spots/spot.model';

describe('SpotsService', () => {
  let service: SpotsService;
  let mockSpotModel: any;

  const mockSpot = {
    id: 'spot-123',
    spotNumber: 'A01',
    type: 'regular',
    isActive: true,
    parkingLotId: 'lot-123',
    parkingLot: {
      id: 'lot-123',
      name: 'Downtown Parking',
      address: '123 Main St',
    },
    reservations: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockSpotModel = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      sequelize: {
        literal: jest.fn().mockReturnValue('mocked_literal'),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotsService,
        {
          provide: getModelToken(Spot),
          useValue: mockSpotModel,
        },
      ],
    }).compile();

    service = module.get<SpotsService>(SpotsService);
  });

  describe('checkAvailability', () => {
    it('should return available spots for given time window', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      
      const tomorrowEnd = new Date();
      tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
      tomorrowEnd.setHours(12, 0, 0, 0);

      const availabilityQuery = {
        startTime: tomorrow.toISOString(),
        endTime: tomorrowEnd.toISOString(),
        lotId: 'lot-123',
        page: 1,
        limit: 10,
      };

      mockSpotModel.findAll.mockResolvedValue([mockSpot]);

      const result = await service.checkAvailability(availabilityQuery);

      expect(result).toEqual([
        {
          id: 'spot-123',
          spotNumber: 'A01',
          type: 'regular',
          isActive: true,
          parkingLotId: 'lot-123',
          parkingLot: {
            id: 'lot-123',
            name: 'Downtown Parking',
            address: '123 Main St',
          },
          createdAt: mockSpot.createdAt,
          updatedAt: mockSpot.updatedAt,
        },
      ]);

      expect(mockSpotModel.findAll).toHaveBeenCalledWith({
        where: {
          isActive: true,
          parkingLotId: 'lot-123',
          id: {
            [Op.notIn]: 'mocked_literal',
          },
        },
        include: expect.arrayContaining([
          expect.objectContaining({
            attributes: ['id', 'name', 'address'],
          }),
        ]),
        limit: 10,
        offset: 0,
        order: [['spotNumber', 'ASC']],
        replacements: {
          endTime: tomorrowEnd,
          startTime: tomorrow,
        },
      });
    });

    it('should filter out spots with conflicting reservations', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      
      const tomorrowEnd = new Date();
      tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
      tomorrowEnd.setHours(11, 0, 0, 0);

      const spotWithReservation = {
        ...mockSpot,
        reservations: [{
          id: 'res-123',
          startTime: tomorrow.toISOString(),
          endTime: tomorrowEnd.toISOString(),
        }],
      };

      // Return empty array to simulate no available spots (conflicts filtered out by NOT IN subquery)
      mockSpotModel.findAll.mockResolvedValue([]);

      const queryStart = new Date();
      queryStart.setDate(queryStart.getDate() + 1);
      queryStart.setHours(10, 0, 0, 0);
      
      const queryEnd = new Date();
      queryEnd.setDate(queryEnd.getDate() + 1);
      queryEnd.setHours(12, 0, 0, 0);

      const result = await service.checkAvailability({
        startTime: queryStart.toISOString(),
        endTime: queryEnd.toISOString(),
        page: 1,
        limit: 10,
      });

      expect(result).toEqual([]); // Should be empty due to conflict
    });
  });

  describe('findById', () => {
    it('should return spot by id', async () => {
      mockSpotModel.findByPk.mockResolvedValue(mockSpot);

      const result = await service.findById('spot-123');

      expect(result).toEqual({
        id: 'spot-123',
        spotNumber: 'A01',
        type: 'regular',
        isActive: true,
        parkingLotId: 'lot-123',
        parkingLot: {
          id: 'lot-123',
          name: 'Downtown Parking',
          address: '123 Main St',
        },
        createdAt: mockSpot.createdAt,
        updatedAt: mockSpot.updatedAt,
      });
    });

    it('should return null when spot not found', async () => {
      mockSpotModel.findByPk.mockResolvedValue(null);

      const result = await service.findById('non-existent');

      expect(result).toBeNull();
    });
  });
});