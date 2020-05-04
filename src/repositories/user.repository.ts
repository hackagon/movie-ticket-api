import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {User, UserCredentials, UserRelations, Card} from '../models';
import {UserCredentialsRepository} from './user-credentials.repository';
import {CardRepository} from './card.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  public readonly card: HasOneRepositoryFactory<Card, typeof User.prototype.id>;

  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource,
    @repository.getter('UserCredentialsRepository') protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>, @repository.getter('CardRepository') protected cardRepositoryGetter: Getter<CardRepository>,
  ) {
    super(User, dataSource);
    this.card = this.createHasOneRepositoryFactoryFor('card', cardRepositoryGetter);
    this.registerInclusionResolver('card', this.card.inclusionResolver);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
  }

  async findCredentials(
    userId: typeof User.prototype.id,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}

export interface Credentials {
  id: string
  email: string;
  password: string;
}
