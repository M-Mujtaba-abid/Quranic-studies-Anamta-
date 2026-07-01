import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { TestimonialService } from './testimonial.service';
import { TestimonialResolver } from './testimonial.resolver';
import { TestimonialRepository } from './repositories/testimonial.repository';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
  ],
  providers: [
    TestimonialService,
    TestimonialResolver,
    TestimonialRepository,
  ],
  exports: [TestimonialService],
})
export class TestimonialsModule {}
