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
  roomId: number;

  @property({
    type: 'string',
  })
  code?: string;


  constructor(data?: Partial<Seat>) {
    super(data);
  }
}

export interface SeatRelations {
  // describe navigational properties here
}

export type SeatWithRelations = Seat & SeatRelations;
