import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {Cinema, CinemaRelations, Room} from '../models';
import {RoomRepository} from './room.repository';

export class CinemaRepository extends DefaultCrudRepository<
  Cinema,
  typeof Cinema.prototype.id,
  CinemaRelations
  > {

  public readonly rooms: HasManyRepositoryFactory<Room, typeof Cinema.prototype.id>;

  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource,
    @repository.getter('RoomRepository') protected roomRepositoryGetter: Getter<RoomRepository>,
  ) {
    super(Cinema, dataSource);
    this.rooms = this.createHasManyRepositoryFactoryFor('rooms', roomRepositoryGetter);
  }
}
