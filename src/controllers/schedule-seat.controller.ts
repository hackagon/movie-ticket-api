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
  Schedule,
  Seat,
} from '../models';
import {ScheduleRepository} from '../repositories';

export class ScheduleSeatController {
  constructor(
    @repository(ScheduleRepository) protected scheduleRepository: ScheduleRepository,
  ) { }

  @get('/schedules/{id}/seats', {
    responses: {
      '200': {
        description: 'Array of Schedule has many Seat',
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
    return this.scheduleRepository.seats(id).find(filter);
  }

  @post('/schedules/{id}/seats', {
    responses: {
      '200': {
        description: 'Schedule model instance',
        content: {'application/json': {schema: getModelSchemaRef(Seat)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Schedule.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Seat, {
            title: 'NewSeatInSchedule',
            exclude: ['id'],
            optional: ['scheduleId']
          }),
        },
      },
    }) seat: Omit<Seat, 'id'>,
  ): Promise<Seat> {
    return this.scheduleRepository.seats(id).create(seat);
  }

  @patch('/schedules/{id}/seats', {
    responses: {
      '200': {
        description: 'Schedule.Seat PATCH success count',
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
    return this.scheduleRepository.seats(id).patch(seat, where);
  }

  @del('/schedules/{id}/seats', {
    responses: {
      '200': {
        description: 'Schedule.Seat DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Seat)) where?: Where<Seat>,
  ): Promise<Count> {
    return this.scheduleRepository.seats(id).delete(where);
  }
}
