import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContactMessageInput } from './dto/create-contact-message.input';
import { ContactMessageRepository } from './repositories/contact-message.repository';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactMessageService {
  constructor(
    private readonly repository: ContactMessageRepository,
    private readonly mailService: MailService,
  ) {}

  async create(input: CreateContactMessageInput) {
    return await this.repository.create(input);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: string) {
    const message = await this.repository.findById(id);
    if (!message) {
      throw new NotFoundException('Contact message not found.');
    }
    return message;
  }

  async markAsRead(id: string) {
    await this.findOne(id);
    return await this.repository.markAsRead(id);
  }

  async reply(id: string, replyContent: string) {
    const message = await this.findOne(id);
    
    // Send reply email and await it so errors are caught by the GraphQL resolver
    await this.mailService.sendContactReplyEmail(
      message.email,
      message.name,
      message.subject,
      replyContent
    );

    // Automatically mark as read when replied
    return await this.repository.markAsRead(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await this.repository.delete(id);
  }
}
