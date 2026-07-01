import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ContactMessage } from './models/contact-message.model';
import { ContactMessageService } from './contact-message.service';
import { CreateContactMessageInput } from './dto/create-contact-message.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => ContactMessage)
export class ContactMessageResolver {
  constructor(private readonly service: ContactMessageService) {}

  // --- Public Mutations ---
  @Mutation(() => ContactMessage)
  async submitContactMessage(
    @Args('createContactMessageInput')
    input: CreateContactMessageInput,
  ) {
    return await this.service.create(input);
  }

  // --- Admin-only Queries ---
  @Query(() => [ContactMessage], { name: 'contactMessages' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.service.findAll();
  }

  @Query(() => ContactMessage, { name: 'contactMessage' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.findOne(id);
  }

  // --- Admin-only Mutations ---
  @Mutation(() => ContactMessage)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async markContactMessageAsRead(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.markAsRead(id);
  }

  @Mutation(() => ContactMessage)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async replyToContactMessage(
    @Args('id', { type: () => ID })
    id: string,
    @Args('replyContent')
    replyContent: string,
  ) {
    return await this.service.reply(id, replyContent);
  }

  @Mutation(() => ContactMessage)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteContactMessage(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.service.remove(id);
  }
}
