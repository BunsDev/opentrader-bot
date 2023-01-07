import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ITweetBrief } from './types/tweet/tweet-brief.interface';
import { TweetBriefEntity } from './types/tweet/tweet-brief.entity';
import { ITwitterSignalEvent } from './twitter-signal-event.interface';

export class TwitterSignalEventEntity implements ITwitterSignalEvent {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  signalId: string;

  @ApiProperty({
    type: () => TweetBriefEntity,
  })
  @ValidateNested()
  @Type(() => TweetBriefEntity)
  @IsDefined()
  tweet: ITweetBrief;

  createdAt: number;

  constructor(signalEvent: TwitterSignalEventEntity) {
    Object.assign(this, signalEvent);
  }
}
