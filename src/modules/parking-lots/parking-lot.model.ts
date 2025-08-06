import { Table, Column, Model, DataType, PrimaryKey, HasMany } from 'sequelize-typescript';
import { Spot } from '../spots/spot.model';

@Table({
  tableName: 'parking_lots',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ParkingLot extends Model<ParkingLot> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '00:00:00',
    field: 'open_time',
  })
  openTime!: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
    defaultValue: '23:59:59',
    field: 'close_time',
  })
  closeTime!: string;

  @HasMany(() => Spot)
  spots!: Spot[];
}