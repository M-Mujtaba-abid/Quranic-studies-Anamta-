import { Args, ID, Query, Mutation, Resolver } from '@nestjs/graphql';
import { Student } from './models/student.model';
import { StudentsService } from './students.service';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';

@Resolver(() => Student)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Mutation(() => Student)
  async createStudent(
    @Args('createStudentInput')
    CreateStudentInput: CreateStudentInput,
  ) {
    return await this.studentsService.create(CreateStudentInput);
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
