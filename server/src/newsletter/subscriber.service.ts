import { ConflictException, Injectable } from '@nestjs/common';
import { SubscribeNewsletterInput } from './dto/subscribe-newsletter.input';
import { SubscriberRepository } from './repositories/subscriber.repository';

@Injectable()
export class SubscriberService {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}

  async subscribe(input: SubscribeNewsletterInput) {
    const existing = await this.subscriberRepository.findByEmail(input.email);

    if (existing) {
      if (existing.isActive) {
        throw new ConflictException('This email is already subscribed.');
      }
      return await this.subscriberRepository.reactivate(existing.id);
    }

    return await this.subscriberRepository.create(input);
  }

  async findAll() {
    return await this.subscriberRepository.findAll();
  }

  async findAllActive() {
    return await this.subscriberRepository.findAllActive();
  }
}
