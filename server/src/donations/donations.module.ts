import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { DonationsService } from './donations.service';
import { DonationsResolver } from './donations.resolver';
import { DonationRepository } from './repositories/donation.repository';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [DonationsService, DonationsResolver, DonationRepository],
  exports: [DonationsService],
})
export class DonationsModule {}
