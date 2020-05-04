import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {Room, RoomRelations, Seat} from '../models';
import {SeatRepository} from './seat.repository';

export class RoomRepository extends DefaultCrudRepository<
  Room,
  typeof Room.prototype.id,
  RoomRelations
  > {

  public readonly seats: HasManyRepositoryFactory<Seat, typeof Room.prototype.id>;

  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource, @repository.getter('SeatRepository') protected seatRepositoryGetter: Getter<SeatRepository>,
  ) {
    super(Room, dataSource);
    this.seats = this.createHasManyRepositoryFactoryFor('seats', seatRepositoryGetter,);
    this.registerInclusionResolver('seats', this.seats.inclusionResolver);
  }
}

export const seatCodes = [
  "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10",
  "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10",
  "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10",
  "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10",
  "E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09", "E10",
]
