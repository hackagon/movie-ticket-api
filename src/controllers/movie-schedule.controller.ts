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
  Movie,
  Schedule,
} from '../models';
import {MovieRepository} from '../repositories';

export class MovieScheduleController {
  constructor(
    @repository(MovieRepository) protected movieRepository: MovieRepository,
  ) { }

  @get('/movies/{id}/schedules', {
    responses: {
      '200': {
        description: 'Array of Movie has many Schedule',
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
    return this.movieRepository.schedules(id).find(filter);
  }

  @post('/movies/{id}/schedules', {
    responses: {
      '200': {
        description: 'Movie model instance',
        content: {'application/json': {schema: getModelSchemaRef(Schedule)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Movie.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Schedule, {
            title: 'NewScheduleInMovie',
            exclude: ['id'],
            optional: ['movieId']
          }),
        },
      },
    }) schedule: Omit<Schedule, 'id'>,
  ): Promise<Schedule> {
    return this.movieRepository.schedules(id).create(schedule);
  }

  @patch('/movies/{id}/schedules', {
    responses: {
      '200': {
        description: 'Movie.Schedule PATCH success count',
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
    return this.movieRepository.schedules(id).patch(schedule, where);
  }

  @del('/movies/{id}/schedules', {
    responses: {
      '200': {
        description: 'Movie.Schedule DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Schedule)) where?: Where<Schedule>,
  ): Promise<Count> {
    return this.movieRepository.schedules(id).delete(where);
  }
}
