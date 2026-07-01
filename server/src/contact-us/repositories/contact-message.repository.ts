import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CreateContactMessageInput } from '../dto/create-contact-message.input';
import { ContactMessage } from '@prisma/client';

@Injectable()
export class ContactMessageRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(input: CreateContactMessageInput): Promise<ContactMessage> {
    return await this.database.contactMessage.create({
      data: {
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        isRead: false,
      },
    });
  }

  async findAll(): Promise<ContactMessage[]> {
    return await this.database.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<ContactMessage | null> {
    return await this.database.contactMessage.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string): Promise<ContactMessage> {
    return await this.database.contactMessage.update({
      where: { id },
      data: {
        isRead: true,
      },
    });
  }

  async delete(id: string): Promise<ContactMessage> {
    return await this.database.contactMessage.delete({
      where: { id },
    });
  }
}
