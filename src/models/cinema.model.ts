import {Entity, model, property, hasMany} from '@loopback/repository';
import {Room} from './room.model';

@model()
export class Cinema extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @hasMany(() => Room)
  rooms: Room[];

  constructor(data?: Partial<Cinema>) {
    super(data);
  }
}

export interface CinemaRelations {
  // describe navigational properties here
}

export type CinemaWithRelations = Cinema & CinemaRelations;
