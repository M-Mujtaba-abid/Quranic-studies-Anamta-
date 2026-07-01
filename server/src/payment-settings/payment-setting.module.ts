import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentSettingService } from './payment-setting.service';
import { PaymentSettingResolver } from './payment-setting.resolver';
import { PaymentSettingRepository } from './repositories/payment-setting.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [
    PaymentSettingService,
    PaymentSettingResolver,
    PaymentSettingRepository,
  ],
  exports: [PaymentSettingService],
})
export class PaymentSettingModule {}
