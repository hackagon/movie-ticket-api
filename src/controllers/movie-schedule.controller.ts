import {Count, CountSchema, Filter, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, getWhereSchemaFor, param, patch, post, requestBody} from '@loopback/rest';
import {Movie, Schedule} from '../models';
import {CinemaRepository, MovieRepository, RoomRepository} from '../repositories';

export class MovieScheduleController {
  constructor(
    @repository(MovieRepository) protected movieRepository: MovieRepository,
    @repository(RoomRepository) protected roomRepository: RoomRepository,
    @repository(CinemaRepository) protected cinemaRepository: CinemaRepository,
  ) {}

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
  ): Promise<any[]> {

    const instance__schedules = await this.movieRepository.schedules(id).find(filter);

    const _instance__schedules = []

    for (const index in instance__schedules) {
      if (instance__schedules.hasOwnProperty(index)) {
        const instance__schedule = instance__schedules[index];
        const roomId = instance__schedule.roomId;
        const instance__room = await this.roomRepository.findById(roomId);
        const cinemaId = instance__room.cinemaId;
        const instance__cinema = await this.cinemaRepository.findById(cinemaId);
        _instance__schedules.push({
          ...instance__schedules[index],
          cinema: instance__cinema
        })
      }
    }
    return _instance__schedules;
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
