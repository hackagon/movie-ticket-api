import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mysql: {
      table: 'movie',
    },
  },
})
export class Movie extends Entity {
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
    type: 'number',
    required: true,
  })
  directorId: number;

  @property({
    type: 'number',
    required: true,
  })
  genreId: number;

  @property({
    type: 'number',
    required: true,
  })
  imdb: number;

  @property({
    type: 'date',
  })
  premiereDate?: string;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'number',
  })
  duration?: number;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt?: string;


  constructor(data?: Partial<Movie>) {
    super(data);
  }
}

export interface MovieRelations {
  // describe navigational properties here
}

export type MovieWithRelations = Movie & MovieRelations;
