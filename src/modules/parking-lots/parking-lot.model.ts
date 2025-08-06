import { Table, Column, Model, DataType, PrimaryKey, HasMany } from 'sequelize-typescript';
import { Spot } from '../spots/spot.model';

@Table({
  tableName: 'parking_lots',
  timestamps: true,
})
export class ParkingLot extends Model<ParkingLot> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.DECIMAL(10, 8),
    allowNull: true,
  })
  latitude: number;

  @Column({
    type: DataType.DECIMAL(11, 8),
    allowNull: true,
  })
  longitude: number;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '00:00:00',
  })
  openTime: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '23:59:59',
  })
  closeTime: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  totalSpots: number;

  @HasMany(() => Spot)
  spots: Spot[];
}