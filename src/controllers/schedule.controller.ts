import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
import BBPromise from "bluebird";
import {Schedule} from '../models';
import {RoomRepository, ScheduleRepository, SeatRepository} from '../repositories';

export class ScheduleController {
  constructor(
    @repository(ScheduleRepository) public scheduleRepository: ScheduleRepository,
    @repository(RoomRepository) public roomRepository: RoomRepository,
    @repository(SeatRepository) public seatRepository: SeatRepository,
  ) {}

  @post('/schedules', {
    responses: {
      '200': {
        description: 'Schedule model instance',
        content: {'application/json': {schema: getModelSchemaRef(Schedule)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Schedule, {
            title: 'NewSchedule',
            exclude: ['id'],
          }),
        },
      },
    })
    schedule: Omit<Schedule, 'id'>,
  ): Promise<Schedule> {
    const roomId = schedule.roomId;
    const instance__room = await this.roomRepository.findById(roomId)
    const instance__schedule = await this.scheduleRepository.create(schedule);
    const seatCodes = instance__room.seatCodes ? JSON.parse(instance__room.seatCodes) : []

    await BBPromise.map(seatCodes, (code: string) => {
      return this.seatRepository.create({
        scheduleId: instance__schedule.id,
        code
      })
    })

    return instance__schedule;
  }

  @get('/schedules/count', {
    responses: {
      '200': {
        description: 'Schedule model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Schedule) where?: Where<Schedule>,
  ): Promise<Count> {
    return this.scheduleRepository.count(where);
  }

  @get('/schedules', {
    responses: {
      '200': {
        description: 'Array of Schedule model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Schedule, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Schedule) filter?: Filter<Schedule>,
  ): Promise<Schedule[]> {
    return this.scheduleRepository.find(filter);
  }

  @patch('/schedules', {
    responses: {
      '200': {
        description: 'Schedule PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Schedule, {partial: true}),
        },
      },
    })
    schedule: Schedule,
    @param.where(Schedule) where?: Where<Schedule>,
  ): Promise<Count> {
    return this.scheduleRepository.updateAll(schedule, where);
  }

  @get('/schedules/{id}', {
    responses: {
      '200': {
        description: 'Schedule model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Schedule, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Schedule, {exclude: 'where'}) filter?: FilterExcludingWhere<Schedule>
  ): Promise<Schedule> {
    return this.scheduleRepository.findById(id, filter);
  }

  @patch('/schedules/{id}', {
    responses: {
      '204': {
        description: 'Schedule PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Schedule, {partial: true}),
        },
      },
    })
    schedule: Schedule,
  ): Promise<void> {
    await this.scheduleRepository.updateById(id, schedule);
  }

  @put('/schedules/{id}', {
    responses: {
      '204': {
        description: 'Schedule PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() schedule: Schedule,
  ): Promise<void> {
    await this.scheduleRepository.replaceById(id, schedule);
  }

  @del('/schedules/{id}', {
    responses: {
      '204': {
        description: 'Schedule DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.seatRepository.deleteAll({
      scheduleId: id
    })
    await this.scheduleRepository.deleteById(id);
  }
}
