import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { ParkingLot } from '../parking-lots/parking-lot.model';
import { Reservation } from '../reservations/reservation.model';
import { SpotType } from '../../common/enums/spot-type.enum';

@Table({
  tableName: 'spots',
  timestamps: true,
  indexes: [
    {
      fields: ['parkingLotId', 'spotNumber'],
      unique: true,
    },
    {
      fields: ['type'],
    },
  ],
})
export class Spot extends Model<Spot> {
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
  spotNumber: string;

  @Column({
    type: DataType.ENUM(...Object.values(SpotType)),
    allowNull: false,
    defaultValue: SpotType.REGULAR,
  })
  type: SpotType;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ForeignKey(() => ParkingLot)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  parkingLotId: string;

  @BelongsTo(() => ParkingLot)
  parkingLot: ParkingLot;

  @HasMany(() => Reservation)
  reservations: Reservation[];
}