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
  User,
  Card,
} from '../models';
import {UserRepository} from '../repositories';

export class UserCardController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/card', {
    responses: {
      '200': {
        description: 'User has one Card',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Card),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Card>,
  ): Promise<Card> {
    return this.userRepository.card(id).get(filter);
  }

  @post('/users/{id}/card', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Card)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {
            title: 'NewCardInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) card: Omit<Card, 'id'>,
  ): Promise<Card> {
    return this.userRepository.card(id).create(card);
  }

  @patch('/users/{id}/card', {
    responses: {
      '200': {
        description: 'User.Card PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {partial: true}),
        },
      },
    })
    card: Partial<Card>,
    @param.query.object('where', getWhereSchemaFor(Card)) where?: Where<Card>,
  ): Promise<Count> {
    return this.userRepository.card(id).patch(card, where);
  }

  @del('/users/{id}/card', {
    responses: {
      '200': {
        description: 'User.Card DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Card)) where?: Where<Card>,
  ): Promise<Count> {
    return this.userRepository.card(id).delete(where);
  }
}
