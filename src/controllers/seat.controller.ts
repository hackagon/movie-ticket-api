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
import {Seat} from '../models';
import {SeatRepository} from '../repositories';

export class SeatController {
  constructor(
    @repository(SeatRepository)
    public seatRepository : SeatRepository,
  ) {}

  @post('/seats', {
    responses: {
      '200': {
        description: 'Seat model instance',
        content: {'application/json': {schema: getModelSchemaRef(Seat)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seat, {
            title: 'NewSeat',
            exclude: ['id'],
          }),
        },
      },
    })
    seat: Omit<Seat, 'id'>,
  ): Promise<Seat> {
    return this.seatRepository.create(seat);
  }

  @get('/seats/count', {
    responses: {
      '200': {
        description: 'Seat model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Seat) where?: Where<Seat>,
  ): Promise<Count> {
    return this.seatRepository.count(where);
  }

  @get('/seats', {
    responses: {
      '200': {
        description: 'Array of Seat model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Seat, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Seat) filter?: Filter<Seat>,
  ): Promise<Seat[]> {
    return this.seatRepository.find(filter);
  }

  @patch('/seats', {
    responses: {
      '200': {
        description: 'Seat PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seat, {partial: true}),
        },
      },
    })
    seat: Seat,
    @param.where(Seat) where?: Where<Seat>,
  ): Promise<Count> {
    return this.seatRepository.updateAll(seat, where);
  }

  @get('/seats/{id}', {
    responses: {
      '200': {
        description: 'Seat model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Seat, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Seat, {exclude: 'where'}) filter?: FilterExcludingWhere<Seat>
  ): Promise<Seat> {
    return this.seatRepository.findById(id, filter);
  }

  @patch('/seats/{id}', {
    responses: {
      '204': {
        description: 'Seat PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seat, {partial: true}),
        },
      },
    })
    seat: Seat,
  ): Promise<void> {
    await this.seatRepository.updateById(id, seat);
  }

  @put('/seats/{id}', {
    responses: {
      '204': {
        description: 'Seat PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() seat: Seat,
  ): Promise<void> {
    await this.seatRepository.replaceById(id, seat);
  }

  @del('/seats/{id}', {
    responses: {
      '204': {
        description: 'Seat DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.seatRepository.deleteById(id);
  }
}
