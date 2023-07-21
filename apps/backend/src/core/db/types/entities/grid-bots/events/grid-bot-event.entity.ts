import { GridBotEventCodeEnum } from '@bifrost/types';
import { IGridBotEvent } from 'src/core/db/types/entities/grid-bots/events/grid-bot-event.interface';

export class GridBotEventEntity implements IGridBotEvent {
  id: string;
  eventCode: GridBotEventCodeEnum;
  message: string;
  createdAt: number;
  data: object | null; // additional context

  botId: string;

  constructor(event: GridBotEventEntity) {
    Object.assign(this, event);
  }
}
