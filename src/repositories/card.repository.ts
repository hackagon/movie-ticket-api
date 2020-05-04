import {DefaultCrudRepository} from '@loopback/repository';
import {Card, CardRelations} from '../models';
import {StagingDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CardRepository extends DefaultCrudRepository<
  Card,
  typeof Card.prototype.id,
  CardRelations
> {
  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource,
  ) {
    super(Card, dataSource);
  }
}
