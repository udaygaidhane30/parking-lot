import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../src/modules/users/users.service';
import { User } from '../src/modules/users/user.model';
import { Reservation } from '../src/modules/reservations/reservation.model';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: any;
  let mockReservationModel: any;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
  };

  beforeEach(async () => {
    mockUserModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };

    mockReservationModel = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Reservation),
          useValue: mockReservationModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
    };

    it('should create a user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(null); // No existing user
      mockUserModel.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });

      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException when user with email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser); // Existing user

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );

      expect(mockUserModel.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      const result = await service.findById('user-123');

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUpcomingReservations', () => {
    it('should return upcoming reservations for a user', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockReservationModel.findAll.mockResolvedValue([]);

      const result = await service.getUpcomingReservations('user-123', { page: 1, limit: 10 });

      expect(result).toEqual([]);
      expect(mockUserModel.findByPk).toHaveBeenCalledWith('user-123');
      expect(mockReservationModel.findAll).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(
        service.getUpcomingReservations('non-existent', { page: 1, limit: 10 })
      ).rejects.toThrow(NotFoundException);
    });
  });
});