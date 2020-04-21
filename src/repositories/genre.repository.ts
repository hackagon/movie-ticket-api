import {DefaultCrudRepository} from '@loopback/repository';
import {Genre, GenreRelations} from '../models';
import {LocalDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class GenreRepository extends DefaultCrudRepository<
  Genre,
  typeof Genre.prototype.id,
  GenreRelations
> {
  constructor(
    @inject('datasources.local') dataSource: LocalDataSource,
  ) {
    super(Genre, dataSource);
  }
}
