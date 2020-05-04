import {Entity, model, property, hasMany} from '@loopback/repository';
import {Seat} from './seat.model';

@model()
export class Room extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt?: string;

  @property({
    type: 'number',
  })
  cinemaId?: number;

  @hasMany(() => Seat)
  seats: Seat[];

  constructor(data?: Partial<Room>) {
    super(data);
  }
}

export interface RoomRelations {
  // describe navigational properties here
}

export type RoomWithRelations = Room & RoomRelations;
