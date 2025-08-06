export class ParkingLotResponseDto {
  id!: string;
  name!: string;
  address!: string;
  openTime!: string;
  closeTime!: string;
  totalSpots!: number;
  availableSpots?: number;
  createdAt!: Date;
  updatedAt!: Date;
}