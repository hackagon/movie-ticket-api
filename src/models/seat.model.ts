import {Entity, model, property} from '@loopback/repository';

@model()
export class Seat extends Entity {
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
  scheduleId: number;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'boolean',
    default: false
  })
  isBooked: Boolean;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt?: string;


  constructor(data?: Partial<Seat>) {
    super(data);
  }
}

export interface SeatRelations {
  // describe navigational properties here
}

export type SeatWithRelations = Seat & SeatRelations;
