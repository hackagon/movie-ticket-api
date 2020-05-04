import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {Room, RoomRelations, Schedule} from '../models';
import {ScheduleRepository} from './schedule.repository';

export class RoomRepository extends DefaultCrudRepository<
  Room,
  typeof Room.prototype.id,
  RoomRelations
  > {

  public readonly schedules: HasManyRepositoryFactory<Schedule, typeof Room.prototype.id>;

  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource, @repository.getter('ScheduleRepository') protected scheduleRepositoryGetter: Getter<ScheduleRepository>,
  ) {
    super(Room, dataSource);
    this.schedules = this.createHasManyRepositoryFactoryFor('schedules', scheduleRepositoryGetter,);
    this.registerInclusionResolver('schedules', this.schedules.inclusionResolver);

  }
}

