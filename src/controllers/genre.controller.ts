import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Genre} from '../models';
import {GenreRepository} from '../repositories';

export class GenreController {
  constructor(
    @repository(GenreRepository)
    public genreRepository : GenreRepository,
  ) {}

  @post('/genres', {
    responses: {
      '200': {
        description: 'Genre model instance',
        content: {'application/json': {schema: getModelSchemaRef(Genre)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Genre, {
            title: 'NewGenre',
            exclude: ['id'],
          }),
        },
      },
    })
    genre: Omit<Genre, 'id'>,
  ): Promise<Genre> {
    return this.genreRepository.create(genre);
  }

  @get('/genres/count', {
    responses: {
      '200': {
        description: 'Genre model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Genre) where?: Where<Genre>,
  ): Promise<Count> {
    return this.genreRepository.count(where);
  }

  @get('/genres', {
    responses: {
      '200': {
        description: 'Array of Genre model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Genre, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Genre) filter?: Filter<Genre>,
  ): Promise<Genre[]> {
    return this.genreRepository.find(filter);
  }

  @patch('/genres', {
    responses: {
      '200': {
        description: 'Genre PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Genre, {partial: true}),
        },
      },
    })
    genre: Genre,
    @param.where(Genre) where?: Where<Genre>,
  ): Promise<Count> {
    return this.genreRepository.updateAll(genre, where);
  }

  @get('/genres/{id}', {
    responses: {
      '200': {
        description: 'Genre model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Genre, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Genre, {exclude: 'where'}) filter?: FilterExcludingWhere<Genre>
  ): Promise<Genre> {
    return this.genreRepository.findById(id, filter);
  }

  @patch('/genres/{id}', {
    responses: {
      '204': {
        description: 'Genre PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Genre, {partial: true}),
        },
      },
    })
    genre: Genre,
  ): Promise<void> {
    await this.genreRepository.updateById(id, genre);
  }

  @put('/genres/{id}', {
    responses: {
      '204': {
        description: 'Genre PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() genre: Genre,
  ): Promise<void> {
    await this.genreRepository.replaceById(id, genre);
  }

  @del('/genres/{id}', {
    responses: {
      '204': {
        description: 'Genre DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.genreRepository.deleteById(id);
  }
}
