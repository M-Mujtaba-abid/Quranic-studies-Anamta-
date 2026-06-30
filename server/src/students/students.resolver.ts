import { Args, ID, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Student } from './models/student.model';
import { StudentsService } from './students.service';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Resolver(() => Student)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Mutation(() => Student)
  async createStudent(
    @Args('createStudentInput')
    createStudentInput: CreateStudentInput,
  ) {
    return await this.studentsService.create(createStudentInput);
  }

  @Query(() => [Student], {
    name: 'students',
  })
  async findAllStudents() {
    return await this.studentsService.findAll();
  }

  @Query(() => Student, {
    name: 'student',
  })
  async findStudentById(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.studentsService.findOne(id);
  }

  @Mutation(() => Student)
  async updateStudent(
    @Args('updateStudentInput')
    updateStudentInput: UpdateStudentInput,
  ) {
    return await this.studentsService.update(updateStudentInput);
  }

  @Mutation(() => Student)
  async deleteStudent(
    @Args('id', { type: () => ID })
    id: string,
  ) {
    return await this.studentsService.remove(id);
  }
}
