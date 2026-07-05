import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { SubscribeNewsletterInput } from '../dto/subscribe-newsletter.input';
import { Subscriber } from '@prisma/client';

@Injectable()
export class SubscriberRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(input: SubscribeNewsletterInput): Promise<Subscriber> {
    return await this.database.subscriber.create({
      data: {
        email: input.email,
      },
    });
  }

  async findAll(): Promise<Subscriber[]> {
    return await this.database.subscriber.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAllActive(): Promise<Subscriber[]> {
    return await this.database.subscriber.findMany({
      where: { isActive: true },
    });
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    return await this.database.subscriber.findUnique({
      where: { email },
    });
  }

  async reactivate(id: string): Promise<Subscriber> {
    return await this.database.subscriber.update({
      where: { id },
      data: { isActive: true },
    });
  }
}
