import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Card extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  level?: string;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt?: string;

  constructor(data?: Partial<Card>) {
    super(data);
  }
}

export interface CardRelations {
  // describe navigational properties here
}

export type CardWithRelations = Card & CardRelations;
