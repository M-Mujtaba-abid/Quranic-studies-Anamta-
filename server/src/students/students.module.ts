import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsResolver } from './students.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { StudentRepository } from './repositories/student.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],

  providers: [StudentsService, StudentsResolver, StudentRepository],
  exports: [StudentsService],
})
export class StudentsModule {}
