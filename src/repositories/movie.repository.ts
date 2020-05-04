import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {Movie, MovieRelations, Schedule} from '../models';
import {ScheduleRepository} from './schedule.repository';

export class MovieRepository extends DefaultCrudRepository<
  Movie,
  typeof Movie.prototype.id,
  MovieRelations
  > {

  public readonly schedules: HasManyRepositoryFactory<Schedule, typeof Movie.prototype.id>;

  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource, @repository.getter('ScheduleRepository') protected scheduleRepositoryGetter: Getter<ScheduleRepository>,
  ) {
    super(Movie, dataSource);
    this.schedules = this.createHasManyRepositoryFactoryFor('schedules', scheduleRepositoryGetter,);
    this.registerInclusionResolver('schedules', this.schedules.inclusionResolver);
  }
}
