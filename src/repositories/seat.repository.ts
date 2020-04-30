import {DefaultCrudRepository} from '@loopback/repository';
import {Seat, SeatRelations} from '../models';
import {StagingDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class SeatRepository extends DefaultCrudRepository<
  Seat,
  typeof Seat.prototype.id,
  SeatRelations
> {
  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource,
  ) {
    super(Seat, dataSource);
  }
}
