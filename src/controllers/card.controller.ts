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
import {Card} from '../models';
import {CardRepository} from '../repositories';

export class CardController {
  constructor(
    @repository(CardRepository)
    public cardRepository : CardRepository,
  ) {}

  @post('/cards', {
    responses: {
      '200': {
        description: 'Card model instance',
        content: {'application/json': {schema: getModelSchemaRef(Card)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {
            title: 'NewCard',
            exclude: ['id'],
          }),
        },
      },
    })
    card: Omit<Card, 'id'>,
  ): Promise<Card> {
    return this.cardRepository.create(card);
  }

  @get('/cards/count', {
    responses: {
      '200': {
        description: 'Card model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Card) where?: Where<Card>,
  ): Promise<Count> {
    return this.cardRepository.count(where);
  }

  @get('/cards', {
    responses: {
      '200': {
        description: 'Array of Card model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Card, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Card) filter?: Filter<Card>,
  ): Promise<Card[]> {
    return this.cardRepository.find(filter);
  }

  @patch('/cards', {
    responses: {
      '200': {
        description: 'Card PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {partial: true}),
        },
      },
    })
    card: Card,
    @param.where(Card) where?: Where<Card>,
  ): Promise<Count> {
    return this.cardRepository.updateAll(card, where);
  }

  @get('/cards/{id}', {
    responses: {
      '200': {
        description: 'Card model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Card, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Card, {exclude: 'where'}) filter?: FilterExcludingWhere<Card>
  ): Promise<Card> {
    return this.cardRepository.findById(id, filter);
  }

  @patch('/cards/{id}', {
    responses: {
      '204': {
        description: 'Card PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Card, {partial: true}),
        },
      },
    })
    card: Card,
  ): Promise<void> {
    await this.cardRepository.updateById(id, card);
  }

  @put('/cards/{id}', {
    responses: {
      '204': {
        description: 'Card PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() card: Card,
  ): Promise<void> {
    await this.cardRepository.replaceById(id, card);
  }

  @del('/cards/{id}', {
    responses: {
      '204': {
        description: 'Card DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cardRepository.deleteById(id);
  }
}
