import {DefaultCrudRepository} from '@loopback/repository';
import {Movie, MovieRelations} from '../models';
import {LocalDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class MovieRepository extends DefaultCrudRepository<
  Movie,
  typeof Movie.prototype.id,
  MovieRelations
> {
  constructor(
    @inject('datasources.local') dataSource: LocalDataSource,
  ) {
    super(Movie, dataSource);
  }
}
