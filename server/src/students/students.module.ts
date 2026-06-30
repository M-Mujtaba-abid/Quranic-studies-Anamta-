import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsResolver } from './students.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { StudentRepository } from './repositories/student.repository';

@Module({
  imports: [DatabaseModule],

  providers: [StudentsService, StudentsResolver, StudentRepository],
})
export class StudentsModule {}
