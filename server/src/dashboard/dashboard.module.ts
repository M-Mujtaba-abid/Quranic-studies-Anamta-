import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardRepository } from './repositories/dashboard.repository';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
  ],
  providers: [
    DashboardService,
    DashboardResolver,
    DashboardRepository,
  ],
  exports: [DashboardService],
})
export class DashboardModule {}
