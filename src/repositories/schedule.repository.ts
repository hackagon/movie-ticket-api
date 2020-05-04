import {DefaultCrudRepository} from '@loopback/repository';
import {Schedule, ScheduleRelations} from '../models';
import {StagingDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ScheduleRepository extends DefaultCrudRepository<
  Schedule,
  typeof Schedule.prototype.id,
  ScheduleRelations
> {
  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource,
  ) {
    super(Schedule, dataSource);
  }
}
