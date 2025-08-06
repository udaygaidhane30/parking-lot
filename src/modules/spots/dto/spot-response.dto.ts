import { SpotType } from '../../../common/enums/spot-type.enum';

export class SpotResponseDto {
  id!: string;
  spotNumber!: string;
  type!: SpotType;
  isActive!: boolean;
  parkingLotId!: string;
  isAvailable?: boolean;
  parkingLot?: {
    id: string;
    name: string;
    address: string;
  };
  createdAt!: Date;
  updatedAt!: Date;
}