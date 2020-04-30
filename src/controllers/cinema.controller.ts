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
import {Cinema} from '../models';
import {CinemaRepository} from '../repositories';

export class CinemaController {
  constructor(
    @repository(CinemaRepository)
    public cinemaRepository : CinemaRepository,
  ) {}

  @post('/cinemas', {
    responses: {
      '200': {
        description: 'Cinema model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cinema)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cinema, {
            title: 'NewCinema',
            exclude: ['id'],
          }),
        },
      },
    })
    cinema: Omit<Cinema, 'id'>,
  ): Promise<Cinema> {
    return this.cinemaRepository.create(cinema);
  }

  @get('/cinemas/count', {
    responses: {
      '200': {
        description: 'Cinema model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Cinema) where?: Where<Cinema>,
  ): Promise<Count> {
    return this.cinemaRepository.count(where);
  }

  @get('/cinemas', {
    responses: {
      '200': {
        description: 'Array of Cinema model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Cinema, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Cinema) filter?: Filter<Cinema>,
  ): Promise<Cinema[]> {
    return this.cinemaRepository.find(filter);
  }

  @patch('/cinemas', {
    responses: {
      '200': {
        description: 'Cinema PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cinema, {partial: true}),
        },
      },
    })
    cinema: Cinema,
    @param.where(Cinema) where?: Where<Cinema>,
  ): Promise<Count> {
    return this.cinemaRepository.updateAll(cinema, where);
  }

  @get('/cinemas/{id}', {
    responses: {
      '200': {
        description: 'Cinema model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Cinema, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Cinema, {exclude: 'where'}) filter?: FilterExcludingWhere<Cinema>
  ): Promise<Cinema> {
    return this.cinemaRepository.findById(id, filter);
  }

  @patch('/cinemas/{id}', {
    responses: {
      '204': {
        description: 'Cinema PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cinema, {partial: true}),
        },
      },
    })
    cinema: Cinema,
  ): Promise<void> {
    await this.cinemaRepository.updateById(id, cinema);
  }

  @put('/cinemas/{id}', {
    responses: {
      '204': {
        description: 'Cinema PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() cinema: Cinema,
  ): Promise<void> {
    await this.cinemaRepository.replaceById(id, cinema);
  }

  @del('/cinemas/{id}', {
    responses: {
      '204': {
        description: 'Cinema DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cinemaRepository.deleteById(id);
  }
}
