import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {Card, CardRelations} from '../models';

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

export enum CardLevel {
  SILVER = "SILVER",
  GOLD = "GOLD",
  DIAMOND = "DIAMOND"
}
