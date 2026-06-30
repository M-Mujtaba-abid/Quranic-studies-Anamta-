import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { CoursesService } from './courses.service';

@Module({
  providers: [CoursesService, CoursesResolver]
})
export class CoursesModule {}
