import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {User, UserCredentials, UserRelations} from '../models';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {

  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource,
  ) {
    super(User, dataSource);
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
  email: string;
  password: string;
}
