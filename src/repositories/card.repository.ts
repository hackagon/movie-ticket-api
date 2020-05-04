import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {Card, CardRelations, Ticket} from '../models';
import {TicketRepository} from './ticket.repository';

export class CardRepository extends DefaultCrudRepository<
  Card,
  typeof Card.prototype.id,
  CardRelations
  > {

  public readonly tickets: HasManyRepositoryFactory<Ticket, typeof Card.prototype.id>;

  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource, @repository.getter('TicketRepository') protected ticketRepositoryGetter: Getter<TicketRepository>,
  ) {
    super(Card, dataSource);
    this.tickets = this.createHasManyRepositoryFactoryFor('tickets', ticketRepositoryGetter,);
    this.registerInclusionResolver('tickets', this.tickets.inclusionResolver);
  }
}

export enum CardLevel {
  SILVER = "SILVER",
  GOLD = "GOLD",
  DIAMOND = "DIAMOND"
}
