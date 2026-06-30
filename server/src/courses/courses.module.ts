import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { CourseRepository } from './repositories/course.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [CoursesService, CoursesResolver, CourseRepository],
})
export class CoursesModule {}
