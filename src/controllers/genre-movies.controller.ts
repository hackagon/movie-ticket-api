import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {Genre, Movie} from '../models';
import {GenreRepository} from '../repositories';

export class GenreMoviesController {
  constructor(
    @repository(GenreRepository) protected genreRepository: GenreRepository
  ) {}

  @get('/genres/{id}/movies')
  async getMoviesByGenreId(
    @param.path.number('id') genreId: typeof Genre.prototype.id
  ): Promise<Movie[]> {
    return this.genreRepository.movies(genreId).find();
  }
}
