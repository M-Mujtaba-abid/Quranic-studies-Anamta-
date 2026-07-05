import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { SubscriberService } from './subscriber.service';
import { SubscriberResolver } from './subscriber.resolver';
import { SubscriberRepository } from './repositories/subscriber.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [SubscriberService, SubscriberResolver, SubscriberRepository],
  exports: [SubscriberService],
})
export class NewsletterModule {}
