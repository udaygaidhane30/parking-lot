export class ParkingLotResponseDto {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  openTime: string;
  closeTime: string;
  totalSpots: number;
  availableSpots?: number;
  createdAt: Date;
  updatedAt: Date;
}