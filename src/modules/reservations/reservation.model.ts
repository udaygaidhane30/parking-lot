import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../users/user.model';
import { Spot } from '../spots/spot.model';
import { ReservationStatus } from '../../common/enums/reservation-status.enum';

@Table({
  tableName: 'reservations',
  timestamps: true,
  indexes: [
    {
      fields: ['spotId', 'startTime', 'endTime'],
    },
    {
      fields: ['userId', 'startTime'],
    },
    {
      fields: ['status'],
    },
  ],
})
export class Reservation extends Model<Reservation> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startTime: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endTime: Date;

  @Column({
    type: DataType.ENUM(...Object.values(ReservationStatus)),
    allowNull: false,
    defaultValue: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => Spot)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  spotId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Spot)
  spot: Spot;
}