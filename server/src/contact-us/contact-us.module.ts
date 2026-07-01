import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { ContactMessageService } from './contact-message.service';
import { ContactMessageResolver } from './contact-message.resolver';
import { ContactMessageRepository } from './repositories/contact-message.repository';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    MailModule,
  ],
  providers: [
    ContactMessageService,
    ContactMessageResolver,
    ContactMessageRepository,
  ],
  exports: [ContactMessageService],
})
export class ContactUsModule {}
