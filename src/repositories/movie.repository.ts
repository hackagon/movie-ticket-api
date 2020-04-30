import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {Movie, MovieRelations} from '../models';

export class MovieRepository extends DefaultCrudRepository<
  Movie,
  typeof Movie.prototype.id,
  MovieRelations
  > {
  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource,
  ) {
    super(Movie, dataSource);
  }
}
