import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Subscriber } from './models/subscriber.model';
import { SubscriberService } from './subscriber.service';
import { SubscribeNewsletterInput } from './dto/subscribe-newsletter.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => Subscriber)
export class SubscriberResolver {
  constructor(private readonly service: SubscriberService) {}

  // --- Public Mutation ---
  @Mutation(() => Subscriber)
  async subscribeToNewsletter(
    @Args('subscribeNewsletterInput')
    input: SubscribeNewsletterInput,
  ) {
    return await this.service.subscribe(input);
  }

  // --- Admin-only Query ---
  @Query(() => [Subscriber], { name: 'subscribers' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.service.findAll();
  }
}
