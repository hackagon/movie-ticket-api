import {Entity, hasMany, model, property} from '@loopback/repository';
import {Movie} from './movie.model';

@model({
  settings: {
    mysql: {
      table: 'genre',
    },
  },
})
export class Genre extends Entity {
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
  imageURL: string;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt?: string;

  @hasMany(() => Movie, {keyFrom: "id"})
  movies?: Movie[];


  constructor(data?: Partial<Genre>) {
    super(data);
  }
}

export interface GenreRelations {
  // describe navigational properties here
}

export type GenreWithRelations = Genre & GenreRelations;
