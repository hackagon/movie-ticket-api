import {Entity, model, property, hasMany} from '@loopback/repository';
import {Seat} from './seat.model';

@model()
export class Schedule extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  movieId: number;

  @property({
    type: 'number',
    required: true,
  })
  roomId: number;

  @property({
    type: 'date',
    required: true,
  })
  startTime: string;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt?: string;

  @hasMany(() => Seat)
  seats: Seat[];

  constructor(data?: Partial<Schedule>) {
    super(data);
  }
}

export interface ScheduleRelations {
  // describe navigational properties here
}

export type ScheduleWithRelations = Schedule & ScheduleRelations;
