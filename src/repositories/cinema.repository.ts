import {DefaultCrudRepository} from '@loopback/repository';
import {Cinema, CinemaRelations} from '../models';
import {StagingDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CinemaRepository extends DefaultCrudRepository<
  Cinema,
  typeof Cinema.prototype.id,
  CinemaRelations
> {
  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource,
  ) {
    super(Cinema, dataSource);
  }
}
