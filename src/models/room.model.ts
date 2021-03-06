import {Entity, model, property, hasMany} from '@loopback/repository';
import {Schedule} from './schedule.model';

export const seatCodes = [
  "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10",
  "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10",
  "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10",
  "D01", "D02", "D03", "D04", "D05", "D06", "D07", "D08", "D09", "D10",
  "E01", "E02", "E03", "E04", "E05", "E06", "E07", "E08", "E09", "E10",
]


@model()
export class Room extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    default: seatCodes
  })
  seatCodes: string;

  @property({
    type: 'date',
    default: () => new Date()
  })
  createdAt?: string;

  @property({
    type: 'number',
  })
  cinemaId?: number;

  @hasMany(() => Schedule)
  schedules: Schedule[];

  constructor(data?: Partial<Room>) {
    super(data);
  }
}

export interface RoomRelations {
  // describe navigational properties here
}

export type RoomWithRelations = Room & RoomRelations;
