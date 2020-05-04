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
  Card,
  Ticket,
} from '../models';
import {CardRepository} from '../repositories';

export class CardTicketController {
  constructor(
    @repository(CardRepository) protected cardRepository: CardRepository,
  ) { }

  @get('/cards/{id}/tickets', {
    responses: {
      '200': {
        description: 'Array of Card has many Ticket',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ticket)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Ticket>,
  ): Promise<Ticket[]> {
    return this.cardRepository.tickets(id).find(filter);
  }

  @post('/cards/{id}/tickets', {
    responses: {
      '200': {
        description: 'Card model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ticket)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Card.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {
            title: 'NewTicketInCard',
            exclude: ['id'],
            optional: ['cardId']
          }),
        },
      },
    }) ticket: Omit<Ticket, 'id'>,
  ): Promise<Ticket> {
    return this.cardRepository.tickets(id).create(ticket);
  }

  @patch('/cards/{id}/tickets', {
    responses: {
      '200': {
        description: 'Card.Ticket PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {partial: true}),
        },
      },
    })
    ticket: Partial<Ticket>,
    @param.query.object('where', getWhereSchemaFor(Ticket)) where?: Where<Ticket>,
  ): Promise<Count> {
    return this.cardRepository.tickets(id).patch(ticket, where);
  }

  @del('/cards/{id}/tickets', {
    responses: {
      '200': {
        description: 'Card.Ticket DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Ticket)) where?: Where<Ticket>,
  ): Promise<Count> {
    return this.cardRepository.tickets(id).delete(where);
  }
}
