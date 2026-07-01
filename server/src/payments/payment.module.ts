import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    MailModule,
    ConfigModule,
  ],
  providers: [
    PaymentService,
    PaymentResolver,
    PaymentRepository,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
