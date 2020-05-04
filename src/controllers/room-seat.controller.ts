import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Room,
  Seat,
} from '../models';
import {RoomRepository} from '../repositories';

export class RoomSeatController {
  constructor(
    @repository(RoomRepository) protected roomRepository: RoomRepository,
  ) { }

  @get('/rooms/{id}/seats', {
    responses: {
      '200': {
        description: 'Array of Room has many Seat',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Seat)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Seat>,
  ): Promise<Seat[]> {
    return this.roomRepository.seats(id).find(filter);
  }

  @post('/rooms/{id}/seats', {
    responses: {
      '200': {
        description: 'Room model instance',
        content: {'application/json': {schema: getModelSchemaRef(Seat)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Room.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seat, {
            title: 'NewSeatInRoom',
            exclude: ['id'],
            optional: ['roomId']
          }),
        },
      },
    }) seat: Omit<Seat, 'id'>,
  ): Promise<Seat> {
    return this.roomRepository.seats(id).create(seat);
  }

  @patch('/rooms/{id}/seats', {
    responses: {
      '200': {
        description: 'Room.Seat PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seat, {partial: true}),
        },
      },
    })
    seat: Partial<Seat>,
    @param.query.object('where', getWhereSchemaFor(Seat)) where?: Where<Seat>,
  ): Promise<Count> {
    return this.roomRepository.seats(id).patch(seat, where);
  }

  @del('/rooms/{id}/seats', {
    responses: {
      '200': {
        description: 'Room.Seat DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Seat)) where?: Where<Seat>,
  ): Promise<Count> {
    return this.roomRepository.seats(id).delete(where);
  }
}
