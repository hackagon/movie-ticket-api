import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, requestBody} from '@loopback/rest';
import createError from "http-errors";
import moment from "moment";
import {Ticket} from '../models';
import {CardRepository, SeatRepository, TicketRepository} from '../repositories';

export class TicketController {
  constructor(
    @repository(TicketRepository) public ticketRepository: TicketRepository,
    @repository(SeatRepository) public seatRepository: SeatRepository,
    @repository(CardRepository) public cardRepository: CardRepository
  ) {}

  @post('/tickets', {
    responses: {
      '200': {
        description: 'Ticket model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ticket)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {
            title: 'NewTicket',
            exclude: ['id'],
          }),
        },
      },
    })
    ticket: Omit<Ticket, 'id'>,
  ): Promise<Ticket> {

    // card level
    const instance__card = await this.cardRepository.findById(ticket.cardId);

    // check seat is booked?
    const instance__seat = await this.seatRepository.findById(ticket.seatId);
    if (instance__seat.isBooked) throw createError(400, "Seat is booked")
    // new Error("Seat is booked");

    // check number of tickets daily
    const startOfDay = moment().startOf('day').format();
    const endOfDay = moment().endOf('day').format();

    const instance__tickets = await this.ticketRepository.find({
      where: {
        cardId: ticket.cardId,
        createdAt: {
          gt: startOfDay,
          lt: endOfDay
        }
      }
    })

    const number_of_tickets = instance__tickets.length;

    if (instance__card.level === "silver" && number_of_tickets > 2)
      throw createError(400, "Silver is allow at most 2 movies every day");

    if (instance__card.level === "gold" && number_of_tickets > 5)
      throw createError(400, "Gold is allow at most 5 movies every day");

    // booking
    const savedTicket = await this.ticketRepository.create(ticket);

    // set isBooked to true
    await this.seatRepository.updateById(ticket.seatId, {isBooked: true});

    return savedTicket
  }

  @get('/tickets/count', {
    responses: {
      '200': {
        description: 'Ticket model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Ticket) where?: Where<Ticket>,
  ): Promise<Count> {
    return this.ticketRepository.count(where);
  }

  @get('/tickets', {
    responses: {
      '200': {
        description: 'Array of Ticket model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Ticket, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Ticket) filter?: Filter<Ticket>,
  ): Promise<Ticket[]> {
    return this.ticketRepository.find(filter);
  }

  // @patch('/tickets', {
  //   responses: {
  //     '200': {
  //       description: 'Ticket PATCH success count',
  //       content: {'application/json': {schema: CountSchema}},
  //     },
  //   },
  // })
  // async updateAll(
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Ticket, {partial: true}),
  //       },
  //     },
  //   })
  //   ticket: Ticket,
  //   @param.where(Ticket) where?: Where<Ticket>,
  // ): Promise<Count> {
  //   return this.ticketRepository.updateAll(ticket, where);
  // }

  @get('/tickets/{id}', {
    responses: {
      '200': {
        description: 'Ticket model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Ticket, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Ticket, {exclude: 'where'}) filter?: FilterExcludingWhere<Ticket>
  ): Promise<Ticket> {
    return this.ticketRepository.findById(id, filter);
  }

  // @patch('/tickets/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Ticket PATCH success',
  //     },
  //   },
  // })
  // async updateById(
  //   @param.path.number('id') id: number,
  //   @requestBody({
  //     content: {
  //       'application/json': {
  //         schema: getModelSchemaRef(Ticket, {partial: true}),
  //       },
  //     },
  //   })
  //   ticket: Ticket,
  // ): Promise<void> {
  //   await this.ticketRepository.updateById(id, ticket);
  // }

  // @put('/tickets/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Ticket PUT success',
  //     },
  //   },
  // })
  // async replaceById(
  //   @param.path.number('id') id: number,
  //   @requestBody() ticket: Ticket,
  // ): Promise<void> {
  //   await this.ticketRepository.replaceById(id, ticket);
  // }

  // @del('/tickets/{id}', {
  //   responses: {
  //     '204': {
  //       description: 'Ticket DELETE success',
  //     },
  //   },
  // })
  // async deleteById(@param.path.number('id') id: number): Promise<void> {
  //   await this.ticketRepository.deleteById(id);
  // }
}
