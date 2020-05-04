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
  Schedule,
} from '../models';
import {RoomRepository} from '../repositories';

export class RoomScheduleController {
  constructor(
    @repository(RoomRepository) protected roomRepository: RoomRepository,
  ) { }

  @get('/rooms/{id}/schedules', {
    responses: {
      '200': {
        description: 'Array of Room has many Schedule',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Schedule)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Schedule>,
  ): Promise<Schedule[]> {
    return this.roomRepository.schedules(id).find(filter);
  }

  @post('/rooms/{id}/schedules', {
    responses: {
      '200': {
        description: 'Room model instance',
        content: {'application/json': {schema: getModelSchemaRef(Schedule)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Room.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Schedule, {
            title: 'NewScheduleInRoom',
            exclude: ['id'],
            optional: ['roomId']
          }),
        },
      },
    }) schedule: Omit<Schedule, 'id'>,
  ): Promise<Schedule> {
    return this.roomRepository.schedules(id).create(schedule);
  }

  @patch('/rooms/{id}/schedules', {
    responses: {
      '200': {
        description: 'Room.Schedule PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Schedule, {partial: true}),
        },
      },
    })
    schedule: Partial<Schedule>,
    @param.query.object('where', getWhereSchemaFor(Schedule)) where?: Where<Schedule>,
  ): Promise<Count> {
    return this.roomRepository.schedules(id).patch(schedule, where);
  }

  @del('/rooms/{id}/schedules', {
    responses: {
      '200': {
        description: 'Room.Schedule DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Schedule)) where?: Where<Schedule>,
  ): Promise<Count> {
    return this.roomRepository.schedules(id).delete(where);
  }
}
