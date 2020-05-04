import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Schedule, ScheduleRelations, Seat} from '../models';
import {StagingDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {SeatRepository} from './seat.repository';

export class ScheduleRepository extends DefaultCrudRepository<
  Schedule,
  typeof Schedule.prototype.id,
  ScheduleRelations
> {

  public readonly seats: HasManyRepositoryFactory<Seat, typeof Schedule.prototype.id>;

  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource, @repository.getter('SeatRepository') protected seatRepositoryGetter: Getter<SeatRepository>,
  ) {
    super(Schedule, dataSource);
    this.seats = this.createHasManyRepositoryFactoryFor('seats', seatRepositoryGetter,);
    this.registerInclusionResolver('seats', this.seats.inclusionResolver);
  }
}
