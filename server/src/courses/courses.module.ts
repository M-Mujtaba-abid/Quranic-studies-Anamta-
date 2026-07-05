import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver, CoursePackageResolver } from './courses.resolver';
import { DatabaseModule } from '../database/database.module';
import { CourseRepository } from './repositories/course.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [CoursesService, CoursesResolver, CoursePackageResolver, CourseRepository],
  exports: [CoursesService],
})
export class CoursesModule {}
