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
  Cinema,
  Room,
} from '../models';
import {CinemaRepository} from '../repositories';

export class CinemaRoomController {
  constructor(
    @repository(CinemaRepository) protected cinemaRepository: CinemaRepository,
  ) { }

  @get('/cinemas/{id}/rooms', {
    responses: {
      '200': {
        description: 'Array of Cinema has many Room',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Room)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Room>,
  ): Promise<Room[]> {
    return this.cinemaRepository.rooms(id).find(filter);
  }

  @post('/cinemas/{id}/rooms', {
    responses: {
      '200': {
        description: 'Cinema model instance',
        content: {'application/json': {schema: getModelSchemaRef(Room)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Cinema.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Room, {
            title: 'NewRoomInCinema',
            exclude: ['id'],
            optional: ['cinemaId']
          }),
        },
      },
    }) room: Omit<Room, 'id'>,
  ): Promise<Room> {
    return this.cinemaRepository.rooms(id).create(room);
  }

  @patch('/cinemas/{id}/rooms', {
    responses: {
      '200': {
        description: 'Cinema.Room PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Room, {partial: true}),
        },
      },
    })
    room: Partial<Room>,
    @param.query.object('where', getWhereSchemaFor(Room)) where?: Where<Room>,
  ): Promise<Count> {
    return this.cinemaRepository.rooms(id).patch(room, where);
  }

  @del('/cinemas/{id}/rooms', {
    responses: {
      '200': {
        description: 'Cinema.Room DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Room)) where?: Where<Room>,
  ): Promise<Count> {
    return this.cinemaRepository.rooms(id).delete(where);
  }
}
