import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {StagingDataSource} from '../datasources';
import {Genre, GenreRelations, Movie} from '../models';
import {MovieRepository} from './movie.repository';

export class GenreRepository extends DefaultCrudRepository<
  Genre,
  typeof Genre.prototype.id,
  GenreRelations
  > {
  public readonly movies: HasManyRepositoryFactory<Movie, typeof Genre.prototype.id>;

  constructor(
    @inject('datasources.staging') dataSource: StagingDataSource,
    @repository.getter('MovieRepository') getMovieRepository: Getter<MovieRepository>

  ) {
    super(Genre, dataSource);
    this.movies = this.createHasManyRepositoryFactoryFor('movies', getMovieRepository)

    this.registerInclusionResolver('movies', this.movies.inclusionResolver);
  }
}
