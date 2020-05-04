import {Entity, model, property, hasMany} from '@loopback/repository';
import {Schedule} from './schedule.model';

@model({
  // settings: {
  //   mysql: {
  //     table: 'movie',
  //   },
  // },
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
    type: 'string',
    required: true,
  })
  director: string;

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

  @hasMany(() => Schedule)
  schedules: Schedule[];

  constructor(data?: Partial<Movie>) {
    super(data);
  }
}

export interface MovieRelations {
  // describe navigational properties here
}

export type MovieWithRelations = Movie & MovieRelations;
