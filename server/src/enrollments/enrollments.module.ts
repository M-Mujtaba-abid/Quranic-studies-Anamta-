import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentResolver } from './enrollment.resolver';
import { EnrollmentRepository } from './repositories/enrollment.repository';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { StudentsModule } from '../students/students.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    StudentsModule,
    CoursesModule,
  ],
  providers: [
    EnrollmentService,
    EnrollmentResolver,
    EnrollmentRepository,
  ],
})
export class EnrollmentsModule {}
