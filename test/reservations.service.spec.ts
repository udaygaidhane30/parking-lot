import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ReservationsService } from '../src/modules/reservations/reservations.service';
import { Reservation } from '../src/modules/reservations/reservation.model';
import { User } from '../src/modules/users/user.model';
import { Spot } from '../src/modules/spots/spot.model';
import { ReservationStatus } from '../src/common/enums/reservation-status.enum';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let mockReservationModel: any;
  let mockUserModel: any;
  let mockSpotModel: any;
  let mockSequelize: any;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockSpot = {
    id: 'spot-123',
    spotNumber: 'A01',
    type: 'regular',
    isActive: true,
    parkingLot: {
      id: 'lot-123',
      name: 'Downtown Parking',
      address: '123 Main St',
    },
  };

  const mockReservation = {
    id: 'res-123',
    userId: 'user-123',
    spotId: 'spot-123',
    startTime: new Date('2024-12-02T10:00:00.000Z'),
    endTime: new Date('2024-12-02T12:00:00.000Z'),
    status: ReservationStatus.ACTIVE,
    user: mockUser,
    spot: mockSpot,
    update: jest.fn(),
  };

  beforeEach(async () => {
    mockReservationModel = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
    };

    mockUserModel = {
      findByPk: jest.fn(),
    };

    mockSpotModel = {
      findByPk: jest.fn(),
    };

    mockSequelize = {
      transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getModelToken(Reservation),
          useValue: mockReservationModel,
        },
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Spot),
          useValue: mockSpotModel,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  describe('create', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    dayAfterTomorrow.setHours(12, 0, 0, 0);

    const createReservationDto = {
      userId: 'user-123',
      spotId: 'spot-123',
      startTime: tomorrow.toISOString(),
      endTime: dayAfterTomorrow.toISOString(),
    };

    beforeEach(() => {
      mockSequelize.transaction.mockImplementation(async (callback: any) => {
        const mockTransaction = {};
        return await callback(mockTransaction);
      });
    });

    it('should create a reservation successfully', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockSpotModel.findByPk.mockResolvedValue(mockSpot);
      mockReservationModel.findAll.mockResolvedValue([]); // No conflicts
      mockReservationModel.create.mockResolvedValue({ id: 'res-123' });
      mockReservationModel.findByPk.mockResolvedValue(mockReservation);

      const result = await service.create(createReservationDto);

      expect(result).toEqual({
        id: 'res-123',
        startTime: mockReservation.startTime,
        endTime: mockReservation.endTime,
        status: ReservationStatus.ACTIVE,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
        spot: {
          id: mockSpot.id,
          spotNumber: mockSpot.spotNumber,
          type: mockSpot.type,
          parkingLot: mockSpot.parkingLot,
        },
      });
    });

    it('should throw ConflictException when spot is already reserved', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockSpotModel.findByPk.mockResolvedValue(mockSpot);
      mockReservationModel.findAll.mockResolvedValue([mockReservation]); // Conflict

      await expect(service.create(createReservationDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when spot not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockSpotModel.findByPk.mockResolvedValue(null);

      await expect(service.create(createReservationDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when start time is after end time', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0);
      
      const earlier = new Date();
      earlier.setDate(earlier.getDate() + 1);
      earlier.setHours(10, 0, 0, 0);

      const invalidDto = {
        ...createReservationDto,
        startTime: tomorrow.toISOString(),
        endTime: earlier.toISOString(),
      };

      await expect(service.create(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('cancel', () => {
    it('should cancel a reservation successfully', async () => {
      mockReservationModel.findByPk.mockResolvedValue(mockReservation);

      await service.cancel('res-123');

      expect(mockReservation.update).toHaveBeenCalledWith({
        status: ReservationStatus.CANCELLED,
      });
    });

    it('should throw NotFoundException when reservation not found', async () => {
      mockReservationModel.findByPk.mockResolvedValue(null);

      await expect(service.cancel('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when reservation is already cancelled', async () => {
      const cancelledReservation = {
        ...mockReservation,
        status: ReservationStatus.CANCELLED,
      };
      mockReservationModel.findByPk.mockResolvedValue(cancelledReservation);

      await expect(service.cancel('res-123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findUpcomingByUser', () => {
    it('should return upcoming reservations for a user', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockReservationModel.findAll.mockResolvedValue([mockReservation]);

      const result = await service.findUpcomingByUser('user-123');

      expect(result).toEqual([
        {
          id: 'res-123',
          startTime: mockReservation.startTime,
          endTime: mockReservation.endTime,
          status: ReservationStatus.ACTIVE,
          user: {
            id: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
          },
          spot: {
            id: mockSpot.id,
            spotNumber: mockSpot.spotNumber,
            type: mockSpot.type,
            parkingLot: mockSpot.parkingLot,
          },
        },
      ]);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.findUpcomingByUser('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});